import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client'
import { hashPassword, comparePassword, generateJWT, checkJWT} from '../helpers/auth'

const prisma = new PrismaClient()


const ListUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    return res.status(200).json(users);
}

const CreateUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (name !== null && email !== null) {
        try {
            const encryptedPassword = await hashPassword(password);
            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: encryptedPassword
                },
            })
            return res.status(201).json(user);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    console.log(
                        `There is a unique constraint violation, a new user cannot be created with this email (${email})`
                    )
                    return res.status(500).json('There is a unique constraint violation, a new user cannot be created with this email')
                }
            }
        }

    } else {
        return res.status(500).json(`Failed to create user, missing params`);
    }
}


const authenticate = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({ where: { email: email}})
    if (user) {
        const isValidPassword = await comparePassword(password, user.password);
        if (isValidPassword) {
            return res.status(200).json(generateJWT(user.id, user.email));
        } else {
            return res.status(403).json(`Failed to authenticate, email or password incorrect`);
        } 
    } else {
        return res.status(403).json(`Failed to authenticate, user doesn't exist`);
    }
}


const checkAuth = async (req: Request, res: Response) => {

}


export default { ListUsers, CreateUser, authenticate, checkAuth }
