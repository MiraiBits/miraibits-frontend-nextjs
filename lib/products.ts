import type { Product } from './types';
import { productDBPrismaClient } from './product-prisma-client';

export async function getProducts(): Promise<Product[]> {
  const products = await productDBPrismaClient.product.findMany();
  return products.map(p => ({
    ...p,
    specifications: p.specifications as { [key: string]: string } | undefined,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await productDBPrismaClient.product.findUnique({
    where: { slug },
  });
  
  if (!product) return null;
  
  return {
    ...product,
    specifications: product.specifications as { [key: string]: string } | undefined,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await productDBPrismaClient.product.findUnique({
    where: { id },
  });
  
  if (!product) return null;
  
  return {
    ...product,
    specifications: product.specifications as { [key: string]: string } | undefined,
  };
}


