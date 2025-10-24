import { PrismaClient } from '../prisma-orders/client'
import { withOptimize } from '@prisma/extension-optimize'

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  
  // Add Optimize extension if API key is available
  if (process.env.OPTIMIZE_API_KEY) {
    return client.$extends(
      withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
    )
  }
  
  return client
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
