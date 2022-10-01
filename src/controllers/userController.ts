import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()


const ListUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    return res.status(200).json(users);
}

const CreateUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    if (name !== null && email !== null) {
        try {
            const user = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
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

export default { ListUsers, CreateUser }
