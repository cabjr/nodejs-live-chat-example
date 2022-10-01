import bcrypt from 'bcrypt';
import { encode, decode, TAlgorithm } from "jwt-simple";

const SECRET_KEY = "4846a2dad6d0f0a821744cf75d7573789db417a36b58612831f77f46dcbf22f043fc629633c04e3fac44cce9cf7e0c64bf8d0e9f8a5c221304a6ce5af4449dee";
const algorithm: TAlgorithm = "HS512";
const saltCryptRounds = 10;
const tokenDuration = 24 * 60 * 60 * 1000; // expires every 24 hours

export interface EncodeResult {
    token: string,
    issued: number,
    expires: number
}

export interface DecodeResult {
    type: string,
    session?: Session
}

export interface Session {
    user_id: number,
    email: string,
    issued: number,
    expires: number
}

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltCryptRounds)
}

export const comparePassword = async (rawPassword: string, hashPassword: string) => {
    return await bcrypt.compareSync(rawPassword, hashPassword);
}


export const generateJWT = (user_id: number, email: string) : EncodeResult => {
    const issued = Date.now();
    const expires = issued + tokenDuration;
    const session = {
        user_id: user_id,
        email: email,
        issued: issued,
        expires: expires,
    };
    const token =  encode(session, SECRET_KEY, algorithm);
    return { token: token, issued: issued, expires: expires };
}


export const checkJWT = (token: string) => {
    let result: Session;
    try {
        result = decode(token, SECRET_KEY, false, algorithm);

    } catch (error) {
        return {
            type: "invalid-token"
        };
    }
    return {
        type: "valid",
        session: result
    }
}

export function checkExpirationStatus(token: Session) {
    const now = Date.now();
    
    if (token.expires > now) return "active";

    const gracePeriod = 1 * 60 * 60 * 1000;
    const threeHoursAfterExpiration = token.expires + gracePeriod;

    if (threeHoursAfterExpiration > now) return "grace";

    return "expired";
}