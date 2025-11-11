# Product Database Migration Guide

**Date**: October 23, 2025  
**Migration**: JSON → Prisma PostgreSQL  
**Status**: ✅ Completed

---

## Table of Contents
1. [What Was Done](#what-was-done)
2. [Technical Implementation](#technical-implementation)
3. [Files Changed](#files-changed)
4. [MongoDB Migration Guide](#mongodb-migration-guide)
5. [Troubleshooting](#troubleshooting)

---

## What Was Done

### Overview
Migrated product storage from a static JSON file (`data/products.json`) to a PostgreSQL database using Prisma ORM, utilizing the `PRISMA_PRODUCT_DB` environment variable for database connection.

### Why This Migration?
- **Dynamic Updates**: Products can now be updated without redeploying the application
- **Scalability**: Database can handle thousands of products efficiently
- **Data Integrity**: Enforced schema validation and relationships
- **Query Performance**: Indexed searches and optimized queries
- **Admin Capabilities**: Foundation for future admin panel to manage products

---

## Technical Implementation

### 1. Database Schema Setup

**Location**: `prisma/schema.prisma`

The schema defines:
```prisma
model Product {
  id               String   @id @default(uuid())
  name             String
  slug             String   @unique
  price            Int
  description      String
  shortDescription String
  images           String[]
  stock            Int
  specifications   Json?
  datasheet        String[]
}
```

**Key Features**:
- UUID primary key for products
- Unique constraint on slug for URL-friendly access
- JSON field for flexible specifications
- Array fields for images and datasheets

### 2. Database Connection

**Environment Variable**: `PRISMA_PRODUCT_DB`
```
PRISMA_PRODUCT_DB="prisma+postgres://accelerate.prisma-data.net/?api_key=..."
```

This uses Prisma Accelerate for connection pooling and edge caching.

### 3. Product Functions Refactored

**File**: `lib/products.ts`

**Before** (Synchronous JSON):
```typescript
export function getProducts(): Product[] {
  return products;
}
```

**After** (Async Prisma):
```typescript
export async function getProducts(): Promise<Product[]> {
  const products = await productDBPrismaClient.product.findMany();
  return products.map(p => ({
    ...p,
    specifications: p.specifications as { [key: string]: string } | undefined,
  }));
}
```

All three functions converted to async:
- `getProducts()` - Fetch all products
- `getProductBySlug(slug)` - Find by URL slug
- `getProductById(id)` - Find by UUID

### 4. Component Updates

#### Server Components (Direct Prisma Access)
These components can directly await the async functions:

- **`app/page.tsx`** - Homepage product grid
- **`app/products/[slug]/page.tsx`** - Product detail page
- **`app/products/[slug]/RelatedProducts.tsx`** - Related products section
- **`app/products/[slug]/opengraph-image.tsx`** - OpenGraph image generation
- **`app/sitemap.ts`** - XML sitemap generation
- **`app/api/orders/route.ts`** - Order creation API

**Pattern Used**:
```typescript
// Before
const products = getProducts();

// After
const products = await getProducts();
```

#### Client Components (API Route Access)
Client components cannot use async server functions, so we created an API route.

**New API Route**: `app/api/products/route.ts`
```typescript
GET /api/products          // Returns all products
GET /api/products?id=xyz   // Returns single product
```

**Cart System Refactor**: `lib/cart.tsx`
- Implemented product caching using React state
- Products fetched from API when added to cart
- Cache prevents redundant API calls
- `productsCache` Map stores product data

**Cart Page Update**: `app/cart/page.tsx`
- Uses `productsCache` from cart context
- Displays products from cache instead of sync lookup

### 5. Data Migration Script

**File**: `scripts/seed-products.ts`

Purpose: Migrate products from JSON to database

**Features**:
- Clears existing products (safe reset)
- Reads from `data/products.json`
- Inserts each product with proper typing
- Provides console feedback for each step

**Usage**:
```bash
npx tsx scripts/seed-products.ts
```

**Output**:
```
Starting product seed...
Cleared existing products
✓ Seeded: Arduino Uno R3
✓ Seeded: ESP32 DevKit V1
✓ Seeded: STM32F103C8T6 Blue Pill
✓ Seeded: HC-SR04 Ultrasonic Sensor
✓ Seeded: BME280 Temperature Humidity Pressure Sensor

✅ Successfully seeded 5 products!
```

### 6. Database Setup Commands

**Step 1 - Generate Prisma Client**:
```bash
npx prisma generate --schema=prisma/schema.prisma
```
Creates TypeScript types and database client.

**Step 2 - Push Schema to Database**:
```bash
npx prisma db push --schema=prisma/schema.prisma
```
Creates tables in PostgreSQL database.

**Step 3 - Seed Products**:
```bash
npx tsx scripts/seed-products.ts
```
Populates database with products from JSON.

---

## Files Changed

### Core Files Modified

1. **`lib/products.ts`**
   - Changed: All functions now async with Prisma queries
   - Impact: Foundation for all product data access

2. **`lib/cart.tsx`**
   - Changed: Added product caching mechanism
   - Impact: Cart works seamlessly with async product data

3. **`app/cart/page.tsx`**
   - Changed: Uses cached products from context
   - Impact: Cart page displays correctly

### New Files Created

1. **`app/api/products/route.ts`**
   - Purpose: API endpoint for client-side product fetching
   - Endpoints: GET with optional ?id parameter

2. **`scripts/seed-products.ts`**
   - Purpose: Migration and seeding script
   - Usage: Run manually to reset/populate products

3. **`docs/PRODUCT_PRISMA_MIGRATION.md`**
   - Purpose: Initial migration documentation

4. **`docs/PRODUCT_DATABASE_MIGRATION_GUIDE.md`** (this file)
   - Purpose: Comprehensive guide and MongoDB migration instructions

### Server Components Updated

All these files updated to use `await`:

- `app/page.tsx`
- `app/products/[slug]/page.tsx`
- `app/products/[slug]/RelatedProducts.tsx`
- `app/products/[slug]/opengraph-image.tsx`
- `app/sitemap.ts`
- `app/api/orders/route.ts`

### Files Preserved

- **`data/products.json`** - Kept as backup and for reference
- **`prisma/schema.prisma`** - Schema was already correct
- **`lib/product-prisma-client.ts`** - Client setup was already correct

---

## MongoDB Migration Guide

### Overview
If you want to migrate from PostgreSQL (current) to MongoDB, here's what you need to do.

### Prerequisites
- MongoDB database (local or cloud like MongoDB Atlas)
- MongoDB connection string
- Prisma supports MongoDB natively

### Step-by-Step Migration

#### 1. Update Prisma Schema

**File**: `prisma/schema.prisma`

**Current (PostgreSQL)**:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("PRISMA_PRODUCT_DB")
}

model Product {
  id               String   @id @default(uuid())
  name             String
  slug             String   @unique
  price            Int
  description      String
  shortDescription String
  images           String[]
  stock            Int
  specifications   Json?
  datasheet        String[]

  @@map("products")
}
```

**Change To (MongoDB)**:
```prisma
datasource db {
  provider = "mongodb"
  url      = env("MONGODB_PRODUCT_DB")
}

model Product {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  slug             String   @unique
  price            Int
  description      String
  shortDescription String
  images           String[]
  stock            Int
  specifications   Json?
  datasheet        String[]

  @@map("products")
}
```

**Key Changes**:
- Provider: `postgresql` → `mongodb`
- ID: `@default(uuid())` → `@default(auto()) @map("_id") @db.ObjectId`
- Connection: New environment variable `MONGODB_PRODUCT_DB`

#### 2. Update Environment Variable

**File**: `.env`

**Add**:
```env
MONGODB_PRODUCT_DB="mongodb+srv://username:password@cluster.mongodb.net/products?retryWrites=true&w=majority"
```

**Options**:
- **MongoDB Atlas** (Cloud): Get connection string from Atlas dashboard
- **Local MongoDB**: `mongodb://localhost:27017/products`
- **Docker MongoDB**: `mongodb://mongo:27017/products`

#### 3. Update Seed Script

**File**: `scripts/seed-products.ts`

**Current works as-is**, but MongoDB IDs will be generated differently:

**Optional Enhancement**:
```typescript
// Instead of using existing IDs from JSON
await productDBPrismaClient.product.create({
  data: {
    // Don't include 'id' - let MongoDB generate it
    name: product.name,
    slug: product.slug,
    price: product.price,
    // ... rest of fields
  },
});
```

#### 4. Regenerate Prisma Client

```bash
# Delete existing client
rm -rf prisma/client

# Generate new client for MongoDB
npx prisma generate --schema=prisma/schema.prisma
```

#### 5. Push Schema to MongoDB

```bash
npx prisma db push --schema=prisma/schema.prisma
```

This creates the collection and indexes in MongoDB.

#### 6. Seed Products

```bash
npx tsx scripts/seed-products.ts
```

#### 7. Test the Application

```bash
npm run dev
```

Visit:
- Homepage: `http://localhost:3000`
- Products: `http://localhost:3000/products`
- Cart: `http://localhost:3000/cart`

### MongoDB-Specific Considerations

#### Advantages
- **Flexible Schema**: JSON specifications field works naturally
- **Horizontal Scaling**: Better for very large product catalogs
- **Document Model**: Products are self-contained documents
- **Array Support**: Native array handling for images/datasheets

#### Differences from PostgreSQL

1. **IDs**: MongoDB uses ObjectId (24 hex chars) instead of UUIDs
2. **Transactions**: Different transaction model (replica sets required)
3. **Joins**: No native joins (but not needed for products)
4. **Full-Text Search**: Built-in text search capabilities

#### Performance Optimization for MongoDB

**Add Indexes** (in schema):
```prisma
model Product {
  // ... fields ...

  @@index([slug])
  @@index([name])
  @@index([price])
}
```

**Full-Text Search** (optional):
```prisma
model Product {
  // ... fields ...

  @@index([name, description], type: Text)
}
```

### Code Changes Required

**Good News**: NONE! 

Your application code (`lib/products.ts`, components, API routes) will work exactly the same because:
- Prisma abstracts database differences
- Same query methods work for both databases
- Type definitions remain identical
- Product interface unchanged

### Migration Checklist

- [ ] Install MongoDB (Atlas/Local/Docker)
- [ ] Get MongoDB connection string
- [ ] Update `prisma/schema.prisma` datasource
- [ ] Update model Product id field for MongoDB
- [ ] Add `MONGODB_PRODUCT_DB` to `.env`
- [ ] Delete `prisma/client` folder
- [ ] Run `npx prisma generate --schema=prisma/schema.prisma`
- [ ] Run `npx prisma db push --schema=prisma/schema.prisma`
- [ ] Run seed script: `npx tsx scripts/seed-products.ts`
- [ ] Test application: `npm run dev`
- [ ] Verify all pages load correctly
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Update production environment variables
- [ ] Deploy

---

## Troubleshooting

### PostgreSQL Issues

**Problem**: "Table does not exist"
```bash
npx prisma db push --schema=prisma/schema.prisma
```

**Problem**: "Client not generated"
```bash
npx prisma generate --schema=prisma/schema.prisma
```

**Problem**: Products not showing
```bash
npx tsx scripts/seed-products.ts
```

### MongoDB Issues

**Problem**: "Connection refused"
- Check MongoDB is running: `mongosh` or `mongo`
- Verify connection string format
- Check firewall/network settings

**Problem**: "Authentication failed"
- Verify username/password in connection string
- Check database user permissions
- Ensure IP whitelist (MongoDB Atlas)

**Problem**: "Cannot find module 'mongodb'"
```bash
npm install mongodb
```

### General Issues

**Problem**: TypeScript errors after migration
```bash
rm -rf .next
npm run build
```

**Problem**: Build fails on Vercel
- Add `MONGODB_PRODUCT_DB` to Vercel environment variables
- Run build command includes Prisma generate
- Check Vercel logs for specific errors

**Problem**: Slow queries
- Add appropriate indexes
- Enable Prisma query logging
- Consider caching layer (Redis)

---

## Best Practices

### Development
1. **Keep JSON Backup**: Always maintain `data/products.json` as source of truth
2. **Version Control**: Commit schema changes separately
3. **Test Locally**: Always test migrations locally first
4. **Seed Script**: Update seed script when adding new products

### Production
1. **Environment Variables**: Use different databases for dev/staging/prod
2. **Backups**: Regular database backups (automated)
3. **Monitoring**: Set up database monitoring and alerts
4. **Connection Pooling**: Use Prisma Accelerate or PgBouncer
5. **Migrations**: Use Prisma Migrate for schema changes

### Security
1. **Environment Variables**: Never commit `.env` to git
2. **API Keys**: Rotate database credentials regularly
3. **Access Control**: Limit database user permissions
4. **SSL/TLS**: Enable encrypted connections in production

---

## Future Enhancements

### Admin Panel
With database in place, you can build:
- Product CRUD operations
- Image upload and management
- Stock level updates
- Price adjustments
- Product analytics

### Advanced Features
- **Search**: Full-text search across products
- **Categories**: Add product categories/tags
- **Reviews**: Customer product reviews
- **Inventory**: Advanced stock management
- **Pricing**: Dynamic pricing, discounts, promotions
- **Analytics**: Track popular products, sales metrics

### Performance Optimization
- **Caching**: Redis cache for frequently accessed products
- **CDN**: Image delivery via CDN
- **Edge Functions**: Deploy to edge for lower latency
- **ISR**: Incremental Static Regeneration for product pages

---

## Summary

### What Changed
- Products moved from JSON to PostgreSQL via Prisma
- All product functions now async
- Client components use API route with caching
- Seed script created for data migration

### What Stayed the Same
- Product interface/types unchanged
- JSON file preserved as backup
- Application functionality identical
- User experience unchanged

### To Move to MongoDB
1. Update Prisma schema (provider + id field)
2. Change environment variable
3. Regenerate Prisma client
4. Push schema and seed data
5. Zero code changes needed!

---

**Document Version**: 1.0  
**Last Updated**: October 23, 2025  
**Author**: GitHub Copilot  
**Questions?** Refer to Prisma docs: https://www.prisma.io/docs/
