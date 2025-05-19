/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "featuredImage" TEXT,
ADD COLUMN     "sections" JSONB,
ADD COLUMN     "slug" TEXT,
ALTER COLUMN "paragraphs" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Blog_type_idx" ON "Blog"("type");

-- CreateIndex
CREATE INDEX "Blog_slug_idx" ON "Blog"("slug");
