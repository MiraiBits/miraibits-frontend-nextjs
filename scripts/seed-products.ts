import { productDBPrismaClient } from '../lib/product-prisma-client';
import productsData from '../data/products.json';

async function seedProducts() {
  try {
    console.log('Starting product seed...');

    // Clear existing products
    await productDBPrismaClient.product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products from JSON
    for (const product of productsData) {
      await productDBPrismaClient.product.create({
        data: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          description: product.description,
          shortDescription: product.shortDescription,
          images: product.images,
          stock: product.stock,
          specifications: product.specifications || {},
          datasheet: product.datasheet || [],
        },
      });
      console.log(`✓ Seeded: ${product.name}`);
    }

    console.log(`\n✅ Successfully seeded ${productsData.length} products!`);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  } finally {
    await productDBPrismaClient.$disconnect();
  }
}

seedProducts();
