# Vercel Build Fix - Multiple Prisma Schemas

**Date**: October 23, 2025  
**Issue**: Vercel build failing with "Could not find Prisma Schema"  
**Status**: ✅ Fixed

---

## The Problem

### Error Message
```
Error: Could not find Prisma Schema that is required for this command.
You can either provide it with `--schema` argument,
set it in your Prisma Config file (e.g., `prisma.config.ts`),
set it as `prisma.schema` in your package.json,
or put it into the default location (`./prisma/schema.prisma`, or `./schema.prisma`.
```

### Root Cause
The application uses **two separate Prisma schemas**:
1. `prisma-orders/schema.prisma` - For order management
2. `prisma-products/schema.prisma` - For product catalog

The Vercel build command in `vercel.json` was:
```json
{
  "buildCommand": "prisma generate --no-engine && next build"
}
```

This command doesn't specify **which** schema to use, causing Prisma to look for a schema in the default location (`./prisma/schema.prisma`), which doesn't exist in this project.

---

## The Solution (Implemented)

### Approach 1: Explicit Schema Paths in vercel.json ✅ ACTIVE

**File**: `vercel.json`

**Updated to**:
```json
{
  "buildCommand": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && npx prisma generate --schema ./prisma-products/schema.prisma --no-engine && next build"
}
```

**How it works**:
1. Generates Prisma client for orders schema
2. Generates Prisma client for products schema  
3. Runs Next.js build

**Advantages**:
- ✅ Explicit and clear
- ✅ Self-documenting (you can see exactly what's happening)
- ✅ No dependency on package.json scripts
- ✅ Works even if package.json changes

**Disadvantages**:
- ❌ Long command in vercel.json
- ❌ Duplicates logic from package.json
- ❌ Need to update in two places if schemas are added/removed

---

## Alternative Approach

### Approach 2: Use npm Script

**File**: `vercel.json`

**Alternative configuration**:
```json
{
  "buildCommand": "npm run generate && next build"
}
```

**Requires**: Existing script in `package.json` (already present):
```json
{
  "scripts": {
    "generate": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && npx prisma generate --schema ./prisma-products/schema.prisma --no-engine"
  }
}
```

**How it works**:
1. Runs the `generate` script from package.json
2. That script generates both Prisma clients
3. Runs Next.js build

**Advantages**:
- ✅ Cleaner vercel.json
- ✅ Single source of truth (package.json)
- ✅ Easy to maintain (update once in package.json)
- ✅ Consistent between local and Vercel builds

**Disadvantages**:
- ❌ Less explicit (need to check package.json to see what happens)
- ❌ Depends on package.json having correct script
- ❌ Extra npm process overhead (minimal)

---

## When to Use Each Approach

### Use Approach 1 (Explicit - Current) When:
- You want maximum clarity in deployment configuration
- Your team prefers seeing the full command
- You rarely change schemas or add new ones
- You want Vercel config to be self-contained

### Use Approach 2 (npm Script) When:
- You have multiple Prisma schemas that change frequently
- You want to maintain build commands in one place
- You prefer DRY (Don't Repeat Yourself) principles
- Your team is comfortable with npm scripts

---

## How to Switch Between Approaches

### Switch to Approach 2 (npm script)

**Step 1**: Update `vercel.json`:
```json
{
  "buildCommand": "npm run generate && next build"
}
```

**Step 2**: Commit and push:
```bash
git add vercel.json
git commit -m "refactor: Use npm script for Vercel build"
git push
```

**Step 3**: Redeploy on Vercel (automatic on push)

### Verify Both Work Locally

**Test Approach 1** (explicit):
```bash
npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && \
npx prisma generate --schema ./prisma-products/schema.prisma --no-engine && \
next build
```

**Test Approach 2** (npm script):
```bash
npm run generate && next build
```

Both should produce identical results.

---

## Understanding the Build Process

### Current Flow (Approach 1)

```
Vercel Deployment
    ↓
Install Dependencies (npm install)
    ↓
Run postinstall script (generates Prisma clients - but might be skipped)
    ↓
Run vercel.json buildCommand
    ↓
Generate prisma-orders/client
    ↓
Generate prisma-products/client
    ↓
Next.js build
    ↓
Deploy
```

### Why postinstall Isn't Enough

Your `package.json` has:
```json
{
  "scripts": {
    "postinstall": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && npx prisma generate --schema ./prisma-products/schema.prisma --no-engine"
  }
}
```

**Problem**: When `vercel.json` has a custom `buildCommand`, it **overrides** the default build process, which means:
- `postinstall` might run during `npm install`
- BUT the custom `buildCommand` in `vercel.json` runs **instead of** `npm run build`
- If `postinstall` fails or is skipped, Prisma clients aren't generated
- The custom `buildCommand` must handle Prisma generation explicitly

---

## Adding a Third Schema (Future)

If you need to add another Prisma schema (e.g., `prisma-users`):

### Approach 1: Update vercel.json
```json
{
  "buildCommand": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && npx prisma generate --schema ./prisma-products/schema.prisma --no-engine && npx prisma generate --schema ./prisma-users/schema.prisma --no-engine && next build"
}
```

### Approach 2: Update package.json only
```json
{
  "scripts": {
    "generate": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && npx prisma generate --schema ./prisma-products/schema.prisma --no-engine && npx prisma generate --schema ./prisma-users/schema.prisma --no-engine"
  }
}
```

With Approach 2, `vercel.json` stays unchanged! ✨

---

## Troubleshooting

### Build Still Fails After Fix

**Check 1**: Verify vercel.json was committed
```bash
git status
git log --oneline -1
```

**Check 2**: Clear Vercel cache
- Go to Vercel Dashboard
- Project Settings → General → Clear Build Cache
- Redeploy

**Check 3**: Check environment variables
```bash
# In Vercel Dashboard, ensure these are set:
PRISMA_PRODUCT_DB=<your-value>
DATABASE_URL=<your-value>
```

**Check 4**: Test locally
```bash
npm run build
```

### Generate Script Doesn't Work Locally

**Check**: Schema paths are correct
```bash
ls -la prisma-orders/schema.prisma
ls -la prisma-products/schema.prisma
```

**Fix**: If paths are wrong, update package.json:
```json
{
  "scripts": {
    "generate": "npx prisma generate --schema ./path/to/schema.prisma --no-engine"
  }
}
```

### Vercel Build is Slow

**Optimization**: Use `--skip-generate` in build command if you're certain clients are already generated:
```json
{
  "buildCommand": "npm run generate && next build"
}
```

**Better**: Leverage Vercel's caching - clients are cached between builds.

---

## Best Practices

### 1. Keep Schemas Organized
```
project/
├── prisma-orders/
│   ├── schema.prisma
│   └── client/
├── prisma-products/
│   ├── schema.prisma
│   └── client/
└── package.json
```

### 2. Use Consistent Scripts
```json
{
  "scripts": {
    "generate": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine && npx prisma generate --schema ./prisma-products/schema.prisma --no-engine",
    "generate:orders": "npx prisma generate --schema ./prisma-orders/schema.prisma --no-engine",
    "generate:products": "npx prisma generate --schema ./prisma-products/schema.prisma --no-engine",
    "postinstall": "npm run generate"
  }
}
```

### 3. Document Your Setup
Keep this file updated when schemas change!

### 4. Test Before Deploying
```bash
# Clean build test
rm -rf .next
rm -rf prisma-orders/client
rm -rf prisma-products/client
npm run build
```

---

## Related Files

- `vercel.json` - Deployment configuration
- `package.json` - npm scripts
- `prisma-orders/schema.prisma` - Orders database schema
- `prisma-products/schema.prisma` - Products database schema
- `lib/db.ts` - Orders Prisma client import
- `lib/order-prisma-client.ts` - Orders Prisma client setup
- `lib/product-prisma-client.ts` - Products Prisma client setup

---

## Summary

### What Was Fixed
- ✅ Updated `vercel.json` to explicitly generate both Prisma schemas
- ✅ Build command now specifies schema paths with `--schema` flag
- ✅ Vercel deployments will succeed

### Two Approaches Available
1. **Explicit paths in vercel.json** (current) - Clear and self-contained
2. **npm script reference** (alternative) - DRY and maintainable

### Recommendation
- **For this project**: Keep Approach 1 (explicit) - it's clear and you have only 2 schemas
- **If you add more schemas**: Consider switching to Approach 2 (npm script)

---

**Document Version**: 1.0  
**Last Updated**: October 23, 2025  
**Next Review**: When adding/removing Prisma schemas
