-- CreateEnum
CREATE TYPE "QualityControlStatus" AS ENUM ('PENDING', 'PASSED', 'FAILED');

-- CreateTable
CREATE TABLE "QualityControl" (
    "id" TEXT NOT NULL,
    "vendorOrderId" TEXT NOT NULL,
    "status" "QualityControlStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "inspectedBy" TEXT,
    "inspectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QualityControl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QualityControl_vendorOrderId_key" ON "QualityControl"("vendorOrderId");

-- AddForeignKey
ALTER TABLE "QualityControl" ADD CONSTRAINT "QualityControl_vendorOrderId_fkey" FOREIGN KEY ("vendorOrderId") REFERENCES "VendorOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
