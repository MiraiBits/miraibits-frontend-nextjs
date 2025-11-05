# Mirai.lk

## Overview

This project is a Next.js application built with TypeScript, Tailwind CSS, and Prisma. It serves as a modern, full-stack web application with a focus on performance and developer experience.

## Build Instructions

To build the project locally, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the build command:**
   ```bash
   npm run build

   npx prisma db push --schema ./prisma-products/schema.prisma
   ```

## Vercel Deployment

To deploy this application to Vercel, follow these steps:

1. **Push your code to a Git repository** (e.g., GitHub, GitLab, Bitbucket).

2. **Import your project into Vercel:**
   - Go to your Vercel dashboard and click "Add New...".
   - Select your Git repository.
   - Vercel will automatically detect that you're using Next.js and configure the build settings for you.

3. **Configure environment variables:**
   - In the project settings in Vercel, add any necessary environment variables (e.g., `DATABASE_URL`).

4. **Deploy:**
   - Click the "Deploy" button. Vercel will build and deploy your application.
