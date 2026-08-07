-- CreateTable
CREATE TABLE "HomePage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageComponent" (
    "id" TEXT NOT NULL,
    "homePageId" TEXT NOT NULL,
    "componentTypeId" TEXT NOT NULL,
    "title" TEXT,
    "content" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageComponent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePage_slug_key" ON "HomePage"("slug");

-- CreateIndex
CREATE INDEX "HomePageComponent_homePageId_idx" ON "HomePageComponent"("homePageId");

-- CreateIndex
CREATE INDEX "HomePageComponent_componentTypeId_idx" ON "HomePageComponent"("componentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "HomePageComponent_homePageId_sortOrder_key" ON "HomePageComponent"("homePageId", "sortOrder");

-- AddForeignKey
ALTER TABLE "HomePageComponent" ADD CONSTRAINT "HomePageComponent_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "HomePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePageComponent" ADD CONSTRAINT "HomePageComponent_componentTypeId_fkey" FOREIGN KEY ("componentTypeId") REFERENCES "ComponentType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
