import { createUser, updateUsername } from '../models/user-functions'
import { prismaMock } from '../singleton'

test('should create new user ', async () => {
  const user = {
    id: 1,
    name: 'Carlos',
    email: 'carlos@prisma.io'
  }

  prismaMock.user.create.mockResolvedValue(user)

  await expect(createUser(user)).resolves.toEqual({
    id: 1,
    name: 'Carlos',
    email: 'carlos@prisma.io'
  })
})

test('should update a users name ', async () => {
  const user = {
    id: 1,
    name: 'Caarlos',
    email: 'carlos@prisma.io',
  }

  prismaMock.user.update.mockResolvedValue(user)

  await expect(updateUsername(user)).resolves.toEqual({
    id: 1,
    name: 'Caarlos',
    email: 'carlos@prisma.io',
  })
})
