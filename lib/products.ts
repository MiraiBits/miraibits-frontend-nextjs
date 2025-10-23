import type { Product } from './types';

// Lazy load Prisma client to avoid initialization issues
const getProductPrisma = async () => {
  const { productDBPrismaClient } = await import('./product-prisma-client');
  return productDBPrismaClient;
};

export async function getProducts(): Promise<Product[]> {
  const prisma = await getProductPrisma();
  const products = await prisma.product.findMany();
  return products.map(p => ({
    ...p,
    specifications: p.specifications as { [key: string]: string } | undefined,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const prisma = await getProductPrisma();
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
  const prisma = await getProductPrisma();
  const product = await prisma.product.findUnique({
    where: { id },
  });
  
  if (!product) return null;
  
  return {
    ...product,
    specifications: product.specifications as { [key: string]: string } | undefined,
  };
}


