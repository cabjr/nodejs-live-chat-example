import prisma from '../client'

interface Channel {
  title: string
  authorId: number
  messages: Message[]
}

interface Message {
  message: string
  authorId: number
  channelId: number
  publishedAt: Date
}


interface CreateUser {
  name: string
  email: string
  password: string
  messages: Message[]
}

export async function createUser(user: CreateUser) {
    return await prisma.user.create({
      data: user,
    })
}

interface UpdateUser {
  id: number
  name: string
  email: string
  password: string
}

export async function updateUsername(user: UpdateUser) {
  return await prisma.user.update({
    where: { id: user.id },
    data: user,
  })
}