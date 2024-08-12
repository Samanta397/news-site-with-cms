-- CreateTable
CREATE TABLE "advertisements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "link" TEXT,
    "is_draft" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "media_id" INTEGER,
    "new_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "advertisements_media_id_key" ON "advertisements"("media_id");

-- CreateIndex
CREATE UNIQUE INDEX "advertisements_new_id_key" ON "advertisements"("new_id");

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_new_id_fkey" FOREIGN KEY ("new_id") REFERENCES "news"("id") ON DELETE CASCADE ON UPDATE CASCADE;
