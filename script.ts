import { PrismaClient } from "@prisma/client";
import { softDeleteExtension } from "./dist";

const prisma = new PrismaClient().$extends(softDeleteExtension())

async function main() {
  const result1 = await prisma.user.softDelete({ id: 1 })
  console.log('should set user as deleted: ', result1.deletedAt !== null)

  const result2 = await prisma.user.restore({ id: 1 })
  console.log('should set user as restored: ', result2.deletedAt === null)

  const result3 = await prisma.user.softDelete({ id: 1 })
  console.log('should set user as deleted: ', result3.deletedAt !== null)

  const result4 = await prisma.user.count()
  console.log('should count users without including deleted ones: ', result4 === 2)

  const result5 = await prisma.user.findMany({
    where: {
      password: 'strong-password'
    }
  })
  console.log('should find users without including deleted ones: ', result5.map((item) => item.deletedAt === null))

  const result6 = await prisma.user.findUnique({
    where: {
      id: 1
    }
  })
  console.log('should not find user when deleted: ', result6 === null)

  const result7 = await prisma.user.findFirst({
    where: {
      deletedAt: {
        not: null
      }
    }
  })
  console.log('should find deleted user when deletedAt have been explicitly requested: ', result7?.deletedAt !== null)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
