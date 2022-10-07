import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client'
import { checkJWT } from '../helpers/auth'

const prisma = new PrismaClient()


const ListChannels = async (req: Request, res: Response) => {
    let channels = await prisma.channel.findMany()
    if (channels.length === 0) {
        const users = await prisma.user.findMany();
        if (users.length > 0) {
            const firstChannel = await prisma.channel.create({ data: { title: 'Default', public: true, authorId: users[0].id }, });
            channels = await prisma.channel.findMany();
        }
    }
    return res.status(200).json(channels);
}

const CreateChannel = async (req: Request, res: Response) => {
    const { channelName, owner } = req.body;
    try {
        if (channelName !== null && owner !== null) {

            return res.status(201).json({});
        }
        else {
            return res.status(500).json(`Failed to create user, missing params`);
        }
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                console.log(
                    `There is a unique constraint violation`
                )
                return res.status(500).json('There is a unique constraint violation, a new user cannot be created with this email')
            }
        }
    }

}

const channelMessages = async (req: Request, res: Response) => {
    const channelName = req.params.channel;
    try {
        if (channelName !== null) {
            const channel = await prisma.channel.findFirst({ where: { title: { equals: channelName } } })
            if (channel) {
                const messages = await prisma.message.findMany({ where: { channelId: { equals: channel.id } }, orderBy: { publishedAt: "asc" }, include: {author: true}})
                return res.status(201).json(messages);
            } else {
                return res.status(500).json(`Failed to fetch channel`);
            }
        }
        else {
            return res.status(500).json(`Failed to fetch messages, missing params`);
        }
    } catch (e) {
        console.log(
            `There is a unique constraint violation`
        )
    }

}


const sendMessage = async (req: Request, res: Response) => {
    const channelName = req.params.channel;
    const message: string = req.body.message;
    try {
        if (channelName !== null) {
            const channel = await prisma.channel.findFirst({ where: { title: { equals: channelName } } })
            if (channel) {
                const token = req.headers.token?.toString();
                if (token) {
                    const sessionInfo = checkJWT(token);
                    if (sessionInfo && sessionInfo.session) {
                        const user = await prisma.user.findFirst({where: {id: sessionInfo.session.user_id}})
                        if (user) {
                            const newMessage = await prisma.message.create({data: {message: message, authorId:user.id, channelId: channel.id}})
                            return res.status(201).json('ok');
                        }                      
                    }
                }
            } else {
                return res.status(500).json(`Failed to fetch channel`);
            }
        }
        else {
            return res.status(500).json(`Failed to fetch messages, missing params`);
        }
    } catch (e) {
        console.log(
            `There is a unique constraint violation`
        )
    }
    return res.status(500).json(`Failed to send message`);
}



export default { ListChannels, CreateChannel, channelMessages, sendMessage }
