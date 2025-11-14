-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM (
  'pending',
  'reviewing_payment',
  'confirmed_payment',
  'shipped',
  'delivered',
  'payment_failed',
  'cancelled'
);

-- AlterTable
ALTER TABLE "orders"
  ADD COLUMN "status" "OrderStatus" NOT NULL DEFAULT 'pending';
