-- CreateTable
CREATE TABLE "settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "amount_per_page" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);
