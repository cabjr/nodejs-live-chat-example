import { Request, Response, NextFunction } from "express";
import {checkExpirationStatus, checkJWT, generateJWT, Session, DecodeResult} from '../helpers/auth'


export function requireJwtMiddleware(request: Request, response: Response, next: NextFunction) {
    const unauthorized = (message: string) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });

    const requestHeader = "token";
    const responseHeader = "renewedToken";
    const header = request.header(requestHeader);
    
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }

    const decodedSession: DecodeResult = checkJWT(header);
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }
    if (decodedSession.session) {
        const expiration: string = checkExpirationStatus(decodedSession.session);
        if (expiration === "expired") {
            unauthorized(`Authorization token has expired. Please create a new authorization token.`);
            return;
        }
    
        let session: Session;
    
        if (expiration === "grace") {
            // Automatically renew the session and send it back with the response
            const { token, expires, issued } = generateJWT(decodedSession.session.user_id, decodedSession.session.email);
            session = {
                ...decodedSession.session,
                expires: expires,
                issued: issued
            };
            response.setHeader(responseHeader, token);
        } else {
            session = decodedSession.session;
        }
        // Set the session on response.locals object for routes to access
        response.locals = {
            ...response.locals,
            session: session
        };

    }
    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}