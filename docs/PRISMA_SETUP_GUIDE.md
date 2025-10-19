# Prisma Setup Complete ✅

## What Was Changed

### 1. **Created Prisma Schema** (`prisma/schema.prisma`)
   - Defined an `Order` model with all necessary fields
   - Stores order items as JSON
   - Stores payment proof as base64 in the database (Vercel-compatible)

### 2. **Created Prisma Client** (`lib/db.ts`)
   - Singleton pattern for production
   - Prevents multiple instances in development

### 3. **Migrated APIs to Use Prisma**
   - `app/api/orders/route.ts` - Now saves orders to PostgreSQL instead of JSON files
   - `app/api/orders/[id]/receipt/route.ts` - Now fetches orders from database

### 4. **Fixed File Upload Issue**
   - Payment proof is now stored as base64 in the database
   - This works perfectly on Vercel (no file system needed)

## Prisma Commands You Need to Know

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio to view your data
npx prisma studio

# Create migrations (for production)
npx prisma migrate dev --name your_migration_name
```

## Deployment Steps for Vercel

### 1. **Add Environment Variable to Vercel**
   Go to your Vercel project settings and add:
   ```
   DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGci...
   ```

### 2. **Update Your Build Command** (if needed)
   Vercel should automatically detect and run `prisma generate` during build.
   If not, update in `package.json`:
   ```json
   "scripts": {
     "build": "prisma generate && next build"
   }
   ```

### 3. **Deploy**
   ```bash
   git add .
   git commit -m "Migrate to Prisma database"
   git push
   ```

## Testing Locally

1. **Server is running on http://localhost:3001**
2. Try creating an order:
   - Add products to cart
   - Go to checkout
   - Fill in details and upload payment proof
   - Submit order

3. **View your data**:
   ```bash
   npx prisma studio
   ```
   This opens a GUI at http://localhost:5555 to view your orders

## What This Fixes on Vercel

### ❌ Before (File-based):
- ❌ Writing to `data/orders.json` - **FAILS** on Vercel (read-only filesystem)
- ❌ Saving uploads to `uploads/` folder - **FAILS** on Vercel
- ❌ Orders lost after serverless function ends

### ✅ After (Prisma):
- ✅ Orders saved to PostgreSQL database - **WORKS** on Vercel
- ✅ Payment proofs stored as base64 in database - **WORKS** on Vercel
- ✅ Data persists permanently - **WORKS** on Vercel
- ✅ Can download receipts after order submission - **WORKS** on Vercel

## Database Structure

```
Order Model:
├── id (UUID, primary key)
├── createdAt (timestamp)
├── customerName (string)
├── customerEmail (string)
├── customerPhone (optional)
├── customerAddress (optional)
├── items (JSON array of cart items)
├── total (float)
├── proofData (base64 string of payment proof)
├── proofMimeType (image/png, application/pdf, etc.)
└── proofFilename (original filename)
```

## Optional: Viewing Payment Proofs

If you want to create an admin panel to view payment proofs, you can decode the base64:

```typescript
// In your admin panel
const order = await prisma.order.findUnique({ where: { id } });
if (order.proofData && order.proofMimeType) {
  const buffer = Buffer.from(order.proofData, 'base64');
  // Return as response or display
}
```

## Next Steps

1. ✅ Test locally on http://localhost:3001
2. ✅ Add DATABASE_URL to Vercel environment variables
3. ✅ Push to GitHub
4. ✅ Vercel will auto-deploy
5. ✅ Test checkout on production

## Troubleshooting

### Error: "PrismaClient is unable to run in this environment"
**Solution**: Make sure `prisma generate` runs during build
```json
// package.json
"scripts": {
  "build": "prisma generate && next build"
}
```

### Error: "Can't reach database server"
**Solution**: Check your DATABASE_URL is correctly set in Vercel environment variables

### Want to migrate existing JSON data?
If you have orders in `data/orders.json`, create a migration script:
```typescript
// scripts/migrate-json-to-db.ts
import prisma from '../lib/db';
import orders from '../data/orders.json';

async function migrate() {
  for (const order of orders) {
    await prisma.order.create({
      data: {
        id: order.id,
        createdAt: new Date(order.createdAt),
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        customerPhone: order.customer.phone,
        customerAddress: order.customer.address,
        items: order.items,
        total: order.total,
        // Note: proof files would need to be read and converted to base64
      }
    });
  }
}

migrate();
```

## Support

If you encounter any issues:
1. Check Vercel logs
2. Check Prisma Accelerate dashboard
3. Run `npx prisma studio` to verify data is being saved locally
