-- CreateTable
CREATE TABLE "AdsBanner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT NOT NULL,
    "linkUrl" TEXT,
    "buttonText" TEXT,
    "position" TEXT NOT NULL DEFAULT 'HOME',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdsBanner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdsBanner_position_idx" ON "AdsBanner"("position");

-- CreateIndex
CREATE INDEX "AdsBanner_isActive_idx" ON "AdsBanner"("isActive");

-- CreateIndex
CREATE INDEX "AdsBanner_startDate_idx" ON "AdsBanner"("startDate");

-- CreateIndex
CREATE INDEX "AdsBanner_endDate_idx" ON "AdsBanner"("endDate");
