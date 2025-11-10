import { PrismaClient } from '../prisma-products/client'
const prismaClientSingleton = (): PrismaClient => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
  
  return client
}

type PrismaClientInstance = PrismaClient

// Lazy initialization - only create client when accessed
let prisma: PrismaClientInstance | undefined

function isClientCompatible(client: unknown): client is PrismaClientInstance {
  if (!client || typeof client !== 'object') return false
  const orderDelegate = (client as Record<string, unknown>).order
  return typeof orderDelegate === 'object' && orderDelegate !== null
}

function getPrismaClient() {
  if (prisma) return prisma
  
  const globalForPrisma = globalThis as unknown as {
    prismaGlobal?: PrismaClientInstance
  }

  if (globalForPrisma.prismaGlobal) {
    const cached = globalForPrisma.prismaGlobal
    if (isClientCompatible(cached)) {
      prisma = cached
      return prisma
    }
    // Drop incompatible cached client (likely from an older schema)
    delete globalForPrisma.prismaGlobal
  }
  
  prisma = prismaClientSingleton()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prismaGlobal = prisma
  }
  
  return prisma
}

const prismaProxy = new Proxy({} as PrismaClientInstance, {
  get(_target, prop) {
    const client = getPrismaClient()
    return (client as any)[prop]
  }
})

export default prismaProxy
