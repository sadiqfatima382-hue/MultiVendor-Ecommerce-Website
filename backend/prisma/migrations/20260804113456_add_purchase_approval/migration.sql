-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
