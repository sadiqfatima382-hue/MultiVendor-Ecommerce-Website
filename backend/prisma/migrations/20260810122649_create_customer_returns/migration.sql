-- CreateEnum
CREATE TYPE "CustomerReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'RECEIVED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CustomerReturnReason" AS ENUM ('DAMAGED', 'WRONG_ITEM', 'DEFECTIVE', 'NOT_AS_DESCRIBED', 'SIZE_ISSUE', 'QUALITY_ISSUE', 'CHANGED_MIND', 'OTHER');

-- CreateTable
CREATE TABLE "CustomerReturn" (
    "id" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "CustomerReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "refundAmount" DECIMAL(10,2),
    "customerNotes" TEXT,
    "adminNotes" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerReturnItem" (
    "id" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" "CustomerReturnReason" NOT NULL,
    "reasonNotes" TEXT,
    "refundAmount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerReturn_returnNumber_key" ON "CustomerReturn"("returnNumber");

-- CreateIndex
CREATE INDEX "CustomerReturn_userId_idx" ON "CustomerReturn"("userId");

-- CreateIndex
CREATE INDEX "CustomerReturn_orderId_idx" ON "CustomerReturn"("orderId");

-- CreateIndex
CREATE INDEX "CustomerReturn_status_idx" ON "CustomerReturn"("status");

-- CreateIndex
CREATE INDEX "CustomerReturn_createdAt_idx" ON "CustomerReturn"("createdAt");

-- CreateIndex
CREATE INDEX "CustomerReturnItem_returnId_idx" ON "CustomerReturnItem"("returnId");

-- CreateIndex
CREATE INDEX "CustomerReturnItem_orderItemId_idx" ON "CustomerReturnItem"("orderItemId");

-- CreateIndex
CREATE INDEX "CustomerReturnItem_productId_idx" ON "CustomerReturnItem"("productId");

-- CreateIndex
CREATE INDEX "CustomerReturnItem_productVariantId_idx" ON "CustomerReturnItem"("productVariantId");

-- AddForeignKey
ALTER TABLE "CustomerReturn" ADD CONSTRAINT "CustomerReturn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturn" ADD CONSTRAINT "CustomerReturn_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturnItem" ADD CONSTRAINT "CustomerReturnItem_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "CustomerReturn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturnItem" ADD CONSTRAINT "CustomerReturnItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturnItem" ADD CONSTRAINT "CustomerReturnItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerReturnItem" ADD CONSTRAINT "CustomerReturnItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
