import { PrismaClient } from '../prisma/client';

const globalForProductDBPrismaClient = global as unknown as {
  productDBPrismaClient: PrismaClient;
};

export const productDBPrismaClient =
  globalForProductDBPrismaClient.productDBPrismaClient || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForProductDBPrismaClient.productDBPrismaClient = productDBPrismaClient;
}
