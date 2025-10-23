import type { Product } from './types';
import { PrismaClient as ProductPrismaClient } from '../prisma-products/client';

// Create a singleton instance
let productPrismaClient: ProductPrismaClient | null = null;

function getProductPrisma() {
  if (!productPrismaClient) {
    productPrismaClient = new ProductPrismaClient();
  }
  return productPrismaClient;
}

export async function getProducts(): Promise<Product[]> {
  const prisma = getProductPrisma();
  const products = await prisma.product.findMany();
  return products.map(p => ({
    ...p,
    specifications: p.specifications as { [key: string]: string } | undefined,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const prisma = getProductPrisma();
  const product = await prisma.product.findUnique({
    where: { slug },
  });
  
  if (!product) return null;
  
  return {
    ...product,
    specifications: product.specifications as { [key: string]: string } | undefined,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const prisma = getProductPrisma();
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (!product) return null;
  
  return {
    ...product,
    specifications: product.specifications as { [key: string]: string } | undefined,
  };
}


