/*
  Warnings:

  - A unique constraint covering the columns `[orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[vendorOrderNumber]` on the table `VendorOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderNumber" TEXT;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productImage" TEXT;

-- AlterTable
ALTER TABLE "VendorOrder" ADD COLUMN     "grandTotal" DECIMAL(10,2),
ADD COLUMN     "vendorOrderNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOrder_vendorOrderNumber_key" ON "VendorOrder"("vendorOrderNumber");
