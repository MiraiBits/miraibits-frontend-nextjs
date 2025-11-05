import { promises as fs } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import type { Prisma } from '../prisma-products/client';
import type { Order } from './types';

type OrderItems = Order['items'];

type OrderRecord = {
  id: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  items: OrderItems;
  total: number;
  proofData: string | null;
  proofMimeType: string | null;
  proofFilename: string | null;
};

type StoredOrderRecord = Omit<OrderRecord, 'createdAt'> & { createdAt: string };

const fallbackDir = path.join(process.cwd(), 'data');
const fallbackFile = path.join(fallbackDir, 'orders-fallback.json');

let prismaUnavailable = false;
let prismaFailureLogged = false;

function markPrismaUnavailable(error: unknown) {
  prismaUnavailable = true;
  if (!prismaFailureLogged) {
    prismaFailureLogged = true;
    console.warn(
      '[orders] Prisma unavailable, falling back to file-based storage.',
      error
    );
  }
}

function isPrismaUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const maybeCode = (error as { code?: string }).code;
  if (typeof maybeCode === 'string') {
    if (maybeCode === 'P1012' || maybeCode === 'P1001' || maybeCode === 'P1002') {
      return true;
    }
  }

  const message =
    error instanceof Error
      ? error.message
      : (error as { message?: string }).message;

  if (typeof message === 'string') {
    const normalized = message.toLowerCase();
    if (
      normalized.includes('environment variable not found') ||
      normalized.includes('invalid datasource url') ||
      normalized.includes('prisma schema loaded from')
    ) {
      return true;
    }
  }

  return false;
}

type CreateOrderData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  items: OrderItems;
  total: number;
  proofData: string | null;
  proofMimeType: string | null;
  proofFilename: string | null;
};

function normalizeItems(value: unknown): OrderItems {
  if (!Array.isArray(value)) return [];

  const items: OrderItems = [];
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue;
    const productId = 'productId' in entry ? (entry as any).productId : undefined;
    const quantity = 'quantity' in entry ? (entry as any).quantity : undefined;
    const price = 'price' in entry ? (entry as any).price : undefined;
    if (typeof productId === 'string' && typeof quantity === 'number' && typeof price === 'number') {
      items.push({ productId, quantity, price });
    }
  }
  return items;
}

function toOrderRecord(order: {
  id: string;
  createdAt: string | Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerAddress: string | null;
  items: unknown;
  total: number;
  proofData: string | null;
  proofMimeType: string | null;
  proofFilename: string | null;
}): OrderRecord {
  const createdAt =
    order.createdAt instanceof Date
      ? order.createdAt
      : new Date(order.createdAt);

  return {
    id: order.id,
    createdAt,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    items: normalizeItems(order.items),
    total: order.total,
    proofData: order.proofData,
    proofMimeType: order.proofMimeType,
    proofFilename: order.proofFilename,
  };
}

async function ensureFallbackDir() {
  await fs.mkdir(fallbackDir, { recursive: true });
}

async function readFallbackOrders(): Promise<StoredOrderRecord[]> {
  try {
    const raw = await fs.readFile(fallbackFile, 'utf8');
    return JSON.parse(raw) as StoredOrderRecord[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeFallbackOrders(orders: StoredOrderRecord[]) {
  await ensureFallbackDir();
  const serialized = JSON.stringify(orders, null, 2);
  await fs.writeFile(fallbackFile, serialized, 'utf8');
}

function fromStored(record: StoredOrderRecord): OrderRecord {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
  };
}

async function fallbackCreateOrder(
  data: CreateOrderData
): Promise<OrderRecord> {
  const existing = await readFallbackOrders();
  const createdAt = new Date();
  const record: StoredOrderRecord = {
    id: randomUUID(),
    createdAt: createdAt.toISOString(),
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone ?? null,
    customerAddress: data.customerAddress ?? null,
    items: normalizeItems(data.items),
    total: data.total,
    proofData: data.proofData ?? null,
    proofMimeType: data.proofMimeType ?? null,
    proofFilename: data.proofFilename ?? null,
  };

  existing.push(record);
  await writeFallbackOrders(existing);
  return fromStored(record);
}

async function fallbackFindOrder(id: string): Promise<OrderRecord | null> {
  const existing = await readFallbackOrders();
  const record = existing.find(order => order.id === id);
  return record ? fromStored(record) : null;
}

async function fallbackCount(): Promise<number> {
  const existing = await readFallbackOrders();
  return existing.length;
}

export async function createOrder(
  data: CreateOrderData
): Promise<{ order: OrderRecord; source: 'prisma' | 'fallback' }> {
  if (!prismaUnavailable) {
    try {
      const { default: prisma } = await import('./db');
      const created = await prisma.order.create({
        data: {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          items: data.items as unknown as Prisma.InputJsonValue,
          total: data.total,
          proofData: data.proofData,
          proofMimeType: data.proofMimeType,
          proofFilename: data.proofFilename,
        },
      });
      return { order: toOrderRecord(created), source: 'prisma' };
    } catch (error) {
      if (isPrismaUnavailableError(error)) {
        markPrismaUnavailable(error);
      } else {
        throw error;
      }
    }
  }

  const order = await fallbackCreateOrder(data);
  return { order, source: 'fallback' };
}

export async function findOrderById(
  id: string
): Promise<{ order: OrderRecord | null; source: 'prisma' | 'fallback' }> {
  if (!prismaUnavailable) {
    try {
      const { default: prisma } = await import('./db');
      const order = await prisma.order.findUnique({ where: { id } });
      return { order: order ? toOrderRecord(order) : null, source: 'prisma' };
    } catch (error) {
      if (isPrismaUnavailableError(error)) {
        markPrismaUnavailable(error);
      } else {
        throw error;
      }
    }
  }

  const order = await fallbackFindOrder(id);
  return { order, source: 'fallback' };
}

export async function countOrders(): Promise<{
  count: number;
  source: 'prisma' | 'fallback';
}> {
  if (!prismaUnavailable) {
    try {
      const { default: prisma } = await import('./db');
      const count = await prisma.order.count();
      return { count, source: 'prisma' };
    } catch (error) {
      if (isPrismaUnavailableError(error)) {
        markPrismaUnavailable(error);
      } else {
        throw error;
      }
    }
  }

  const count = await fallbackCount();
  return { count, source: 'fallback' };
}
