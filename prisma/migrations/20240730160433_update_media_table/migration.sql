/*
  Warnings:

  - You are about to drop the column `link` on the `media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file_name]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_name` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "media_link_key";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "link",
ADD COLUMN     "file_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "media_file_name_key" ON "media"("file_name");
