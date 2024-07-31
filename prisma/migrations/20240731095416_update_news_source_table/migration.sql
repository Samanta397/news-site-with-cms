/*
  Warnings:

  - Added the required column `name` to the `news_source` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "news_source" ADD COLUMN     "name" TEXT NOT NULL;
