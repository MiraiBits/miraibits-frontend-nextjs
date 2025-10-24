import { PrismaClient } from '../prisma-orders/client';

const globalForOrderDBPrismaClient = global as unknown as {
  orderDBPrismaClient: PrismaClient;
};

export const orderDBPrismaClient =
  globalForOrderDBPrismaClient.orderDBPrismaClient || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForOrderDBPrismaClient.orderDBPrismaClient = orderDBPrismaClient;
}
