-- AlterTable
ALTER TABLE "advertisements" ADD COLUMN     "is_filter_page" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_list_page" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_main_page" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_search_page" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "regExp" TEXT;
