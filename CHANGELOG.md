## 0.2.0 (2025-11-05)

### Feat

- **Make-all-commits-conventional**: use comitzen
- Replace HTML logo with actual image in email templates
- Add comprehensive Product Database Migration Guide for JSON to Prisma PostgreSQL transition
- Migrate product data to Prisma database and implement new API route
- update arduino uno r3 images
- Use SSH key for checkout in vulnerability-check workflow
- Add contents: read permission to vulnerability-check workflow
- Add Vercel Analytics
- Add Vercel Speed Insights
- Update About Us page and add new service pages
- Implement collapsible mobile navigation
- enhance receipt PDF layout and formatting for improved readability
- migrate PDF font from Helvetica to Courier for improved consistency with Share Tech Mono style
- Migrate PDF generation from server-side (Puppeteer) to client-side (jsPDF)
- add comprehensive documentation for order submission debugging, Prisma optimization, and Vercel deployment processes
- enhance receipt generation with detailed logging and dynamic Puppeteer configuration
- add health check endpoint for diagnostics
- add detailed error logging and user feedback for order submission
- add Vercel troubleshooting guide and update build command for Prisma
- implement Vercel build fix with --no-engine flag for Prisma Accelerate
- integrate Prisma Optimize for enhanced query performance monitoring
- migrate order management to Prisma database for Vercel compatibility
- add clear cart button to CartInner and update cart item count badge style in Navbar
- update PDF generation and email attachment handling for receipts
- enhance product detail page with image gallery, specifications, stock availability, and related products
- Generate PDF receipts
- enhance ProductCard component with keyboard navigation and prevent event propagation
- integrate cart context to display product quantities in ProductsClient
- Size PDF receipts to content
- add static export configuration with notes on dynamic API routes
- integrate Resend API for order email notifications and enhance email formatting
- add resend package as a dependency
- implement order submission and response handling in Checkout component feat: add sample order data to orders.json
- Complete and refine dark mode theme
- Implement comprehensive dark mode theme
- add GitHub Actions workflow for vulnerability and outdated package checks
- Add README.md with build and deployment instructions
- Add dark mode toggle and fix styles
- Add dark mode toggle
- Add dark mode toggle

### Fix

- Update fallback email address to miraibits.electronics@gmail.com in Footer and email sending functions
- Update build and postinstall scripts for Prisma client generation
- Disable postinstall flag in Prisma client configuration
- Remove postinstall flag from Prisma client configuration
- Use direct PrismaClient import with singleton pattern
- Use lazy loading for product Prisma client to avoid initialization errors
- Resolve infinite loop in cart product fetching
- Update checkout page to use productsCache from cart context
- Update Vercel build command to explicitly generate multiple Prisma schemas
- Authorize raw.githubusercontent.com for Next.js Image Optimization
- Resolve build error and ESLint warning
- **cart**: make cart item layout responsive
- lazy-load Prisma client to prevent build-time instantiation
- add runtime config and logging to prevent build-time database access
- use --no-engine flag for Prisma Accelerate on Vercel
- Use /tmp directory for file storage on Vercel
- export renderOrderReceiptHtml to resolve build error
- update default column count to 4 in ProductsClient component
- add uploads directory to .gitignore
- Downgrade actions/checkout to v3 in vulnerability-check workflow
- Resolve Vercel build failure
- grant pull-request write permission to workflow

### Refactor

- remove search form and cart link from Navbar component
