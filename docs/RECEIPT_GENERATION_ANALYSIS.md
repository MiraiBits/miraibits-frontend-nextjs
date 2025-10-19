# Receipt Generation Analysis & Headless Instance Feasibility

## Overview
This document explains how receipt generation works in the Miraibits Next.js e-commerce application and evaluates its feasibility for headless (serverless) environments like Vercel.

---

## How Receipt Generation Works

### 1. **Flow Diagram**
```
Customer Order Submission
    ↓
POST /api/orders (route.ts)
    ↓
Store order in Prisma/PostgreSQL
    ↓
Fire & Forget: sendOrderEmail() ← async, non-blocking
    ↓
renderOrderReceiptHtml() → HTML string
    ↓
generateReceiptPdf() → PDF via Puppeteer
    ↓
Send emails via Resend API:
    - Staff notification (with PDF + proof attachment)
    - Customer receipt (with PDF + proof attachment)
```

### 2. **Key Components**

#### **A. Order Creation API** (`/app/api/orders/route.ts`)
- Receives order via POST request with form data
- Validates customer info and cart items
- Stores payment proof as **base64 in database** (Vercel-compatible, no file system)
- Creates order record in PostgreSQL via Prisma
- Triggers email sending asynchronously (fire & forget)

#### **B. HTML Template Generation** (`/lib/email.ts`)
- `renderOrderReceiptHtml()` function creates a styled HTML receipt
- Uses inline CSS with Google Fonts (Share Tech Mono)
- Displays:
  - Order ID and timestamp
  - Customer billing details
  - Itemized product list with quantities and prices
  - Grand total
  - Company branding and footer

#### **C. PDF Generation** (`/lib/pdf.ts`)
- **Technology Stack:**
  - `puppeteer-core` (headless browser API)
  - `@sparticuz/chromium` (AWS Lambda compatible Chromium binary)

- **Process:**
  1. Launch headless Chrome browser
  2. Create new page
  3. Render HTML content with `networkidle0` wait condition
  4. Calculate dynamic dimensions from rendered content
  5. Generate PDF with print background enabled
  6. Close browser
  7. Return PDF as `Uint8Array`

- **Environment-Specific Configuration:**
  ```typescript
  executablePath: process.env.NODE_ENV === 'production'
    ? await chromium.executablePath()  // Vercel/Lambda
    : '/usr/bin/chromium-browser'      // Local dev
  ```

#### **D. Email Delivery** (`/lib/email.ts`)
- Uses **Resend** API for email delivery
- Sends two emails:
  1. **Staff Notification** → `miraibits.electronics@gmail.com`
  2. **Customer Receipt** → customer's email
- Attachments:
  - Generated PDF receipt
  - Customer's payment proof (from database base64)

#### **E. On-Demand Receipt API** (`/app/api/orders/[id]/receipt/route.ts`)
- Allows downloading receipt later
- GET endpoint: `/api/orders/{orderId}/receipt`
- Fetches order from database
- Regenerates PDF on-the-fly
- Returns as downloadable PDF file

---

## Headless Instance Feasibility

### ✅ **YES - It's Feasible, But With Considerations**

### **Why It Works:**

#### 1. **Serverless-Optimized Dependencies**
- `@sparticuz/chromium` is specifically designed for AWS Lambda and Vercel
- Provides pre-compiled Chromium binaries for serverless environments
- Handles the complexity of running headless Chrome in restricted environments

#### 2. **No File System Dependencies**
- Payment proofs stored as **base64 in PostgreSQL** (not filesystem)
- PDFs generated in-memory and sent directly
- No need for `/tmp` directory or persistent storage

#### 3. **Async Email Handling**
- Email sending is **fire-and-forget** (non-blocking)
- Order API responds immediately after database write
- PDF generation happens in background without blocking response

#### 4. **Vercel Runtime Configuration**
```typescript
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
```
- Uses Node.js runtime (supports Puppeteer)
- Forces dynamic rendering (no static generation)

---

## Potential Challenges & Solutions

### ⚠️ **Challenge 1: Cold Start Times**
**Problem:** Launching Chromium on serverless cold starts can take 3-5 seconds

**Solutions:**
- ✅ Already implemented: Fire-and-forget email sending
- ✅ User doesn't wait for PDF generation
- Consider: Warm-up lambda functions or move to queue-based processing

### ⚠️ **Challenge 2: Memory Consumption**
**Problem:** Puppeteer + Chromium can use 200-300MB RAM

**Vercel Limits:**
- Hobby: 1024 MB
- Pro: 3008 MB

**Solution:**
- ✅ Current setup is within limits
- Monitor usage with Vercel analytics
- Optimize if needed by reducing PDF complexity

### ⚠️ **Challenge 3: Execution Timeout**
**Problem:** Vercel has execution time limits
- Hobby: 10 seconds
- Pro: 60 seconds

**Solution:**
- ✅ Fire-and-forget pattern prevents timeout on order creation
- PDF generation typically takes 2-4 seconds
- Monitored with console logs

### ⚠️ **Challenge 4: Package Size**
**Problem:** `@sparticuz/chromium` adds ~50MB to deployment

**Solution:**
- ✅ Already using `@sparticuz/chromium` (optimized for serverless)
- Vercel supports deployments up to 250MB
- Within acceptable limits

---

## Architecture Recommendations

### **Current Setup: ⭐ Good for Small-Medium Scale**
- Direct PDF generation in API routes
- Works well for:
  - Low-medium order volume (< 1000/day)
  - Simple receipt generation
  - Vercel hobby/pro tier

### **Recommended for High Scale:**
If you expect high order volumes, consider:

#### **Option 1: Queue-Based Processing**
```
Order Created → Queue Job → Worker generates PDF → Email sent
```
**Tools:**
- Vercel Queue (if available)
- AWS SQS + Lambda
- Redis Bull Queue

**Benefits:**
- Better error handling
- Retry mechanisms
- No cold start impact on user

#### **Option 2: Alternative PDF Libraries**
Replace Puppeteer with lighter alternatives:
- **PDFKit** (Node.js native, no browser needed)
- **jsPDF** (client-side capable)
- **Playwright** (similar to Puppeteer but faster)

**Trade-offs:**
- Less HTML/CSS flexibility
- More manual layout coding
- Faster execution

#### **Option 3: Hybrid Approach**
- Generate simple HTML receipt immediately
- Generate PDF asynchronously via queue
- Store PDF in S3/Cloudinary
- Send email with link to download

---

## Performance Metrics (Expected)

### **Development Environment:**
- PDF Generation: 2-3 seconds
- Email Sending: 1-2 seconds
- Total: 3-5 seconds (non-blocking)

### **Production (Vercel):**
- Cold Start: 4-6 seconds (first request)
- Warm Start: 2-3 seconds (subsequent requests)
- User Experience: **Not affected** (fire-and-forget)

---

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."  # For Prisma migrations

# Email
RESEND_API_KEY="re_..."
COMPANY_EMAIL="noreply@yourdomain.com"
COMPANY_NAME="Miraibits"
COMPANY_ADDRESS="Colombo, Sri Lanka"

# Production only
NODE_ENV="production"

# Optional (for local development)
PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
```

---

## Testing in Headless Mode

### **Local Testing:**
```bash
# Install Chromium
sudo apt-get install chromium-browser  # Ubuntu/Debian
# or
brew install chromium  # macOS

# Run in production mode locally
NODE_ENV=production npm run build
npm start
```

### **Vercel Testing:**
```bash
# Deploy to preview
vercel --prod

# Test order creation
curl -X POST https://your-app.vercel.app/api/orders \
  -F "name=Test User" \
  -F "email=test@example.com" \
  -F "cart=[...]" \
  -F "proof=@payment.jpg"

# Check Vercel logs
vercel logs
```

---

## Monitoring & Debugging

### **Key Logs to Monitor:**
```typescript
console.log('Receipt API: PDF generated, size:', pdfBuffer.length);
console.log('Staff notification sent for Order ID:', id);
console.log('Customer receipt sent for Order ID:', id);
```

### **Common Issues:**

| Error | Cause | Solution |
|-------|-------|----------|
| "Chromium not found" | Missing binary | Check `@sparticuz/chromium` installation |
| "Timeout error" | Cold start too long | Move to queue or optimize |
| "Memory limit exceeded" | Large orders/images | Reduce HTML complexity |
| "Email failed" | Resend API issue | Check API key and logs |

---

## Conclusion

### ✅ **Verdict: FEASIBLE for Headless/Vercel**

**Strengths:**
- Well-architected with serverless in mind
- Uses appropriate libraries (`@sparticuz/chromium`)
- Fire-and-forget pattern prevents blocking
- No filesystem dependencies

**Recommended Actions:**
1. ✅ **Deploy as-is for MVP/launch** - current setup is production-ready
2. 📊 **Monitor performance** - track cold starts and memory usage
3. 🚀 **Scale later if needed** - move to queue-based if order volume grows

**When to Optimize:**
- Order volume > 1000/day
- Frequent timeout errors
- Cold start complaints from users
- Need for better error recovery

---

## Additional Resources

- [Puppeteer on AWS Lambda](https://github.com/Sparticuz/chromium)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Resend Email API](https://resend.com/docs)
- [Prisma Optimize](https://www.prisma.io/docs/guides/performance-and-optimization/prisma-optimize)

---

**Generated:** October 19, 2025  
**Project:** Miraibits E-commerce Platform  
**Stack:** Next.js 15 + Puppeteer + Prisma + Resend
