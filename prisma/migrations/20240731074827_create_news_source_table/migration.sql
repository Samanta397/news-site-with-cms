/*
  Warnings:

  - A unique constraint covering the columns `[source_id]` on the table `news` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "news" ADD COLUMN     "source_id" INTEGER;

-- CreateTable
CREATE TABLE "tags_on_source_news" (
    "source_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "tags_on_source_news_pkey" PRIMARY KEY ("source_id","tag_id")
);

-- CreateTable
CREATE TABLE "news_source" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "has_title" BOOLEAN NOT NULL DEFAULT true,
    "has_content" BOOLEAN NOT NULL DEFAULT true,
    "has_author" BOOLEAN NOT NULL DEFAULT true,
    "has_pub_date" BOOLEAN NOT NULL DEFAULT true,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "import_interval" INTEGER NOT NULL DEFAULT 5,
    "next_import_time" TIMESTAMP(3),
    "last_import_time" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_source_url_key" ON "news_source"("url");

-- CreateIndex
CREATE UNIQUE INDEX "news_source_id_key" ON "news"("source_id");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "news_source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_source_news" ADD CONSTRAINT "tags_on_source_news_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "news_source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_on_source_news" ADD CONSTRAINT "tags_on_source_news_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
