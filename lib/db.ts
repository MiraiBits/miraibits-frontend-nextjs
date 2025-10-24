import { PrismaClient } from '../prisma-orders/client'
import { withOptimize } from '@prisma/extension-optimize'

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

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

// Lazy initialization - only create client when accessed
let prisma: ReturnType<typeof prismaClientSingleton> | undefined

function getPrismaClient() {
  if (prisma) return prisma
  
  if (globalThis.prismaGlobal) {
    prisma = globalThis.prismaGlobal
    return prisma
  }
  
  prisma = prismaClientSingleton()
  
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prisma
  }
  
  return prisma
}

const prismaProxy = new Proxy({} as ReturnType<typeof prismaClientSingleton>, {
  get(_target, prop) {
    const client = getPrismaClient()
    return (client as any)[prop]
  }
})

export default prismaProxy
