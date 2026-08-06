-- CreateEnum
CREATE TYPE "WebsiteIconType" AS ENUM ('LOGO', 'DARK_LOGO', 'MOBILE_LOGO', 'FOOTER_LOGO', 'ADMIN_LOGO', 'EMAIL_LOGO', 'FAVICON');

-- CreateTable
CREATE TABLE "WebsiteIcon" (
    "id" TEXT NOT NULL,
    "type" "WebsiteIconType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteIcon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteIcon_type_key" ON "WebsiteIcon"("type");
