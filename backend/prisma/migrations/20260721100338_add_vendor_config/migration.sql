-- CreateTable
CREATE TABLE "VendorConfig" (
    "id" TEXT NOT NULL,
    "logo" TEXT,
    "banner" TEXT,
    "storeDescription" TEXT,
    "businessEmail" TEXT,
    "businessPhone" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "youtube" TEXT,
    "returnPolicy" TEXT,
    "shippingPolicy" TEXT,
    "privacyPolicy" TEXT,
    "termsConditions" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorConfig_vendorId_key" ON "VendorConfig"("vendorId");

-- AddForeignKey
ALTER TABLE "VendorConfig" ADD CONSTRAINT "VendorConfig_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
