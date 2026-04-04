-- CreateTable
CREATE TABLE "public"."links" (
    "id" TEXT NOT NULL,
    "original_url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."click_events" (
    "id" TEXT NOT NULL,
    "link_id" TEXT NOT NULL,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "clicked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_slug_key" ON "public"."links"("slug");

-- CreateIndex
CREATE INDEX "click_events_link_id_idx" ON "public"."click_events"("link_id");

-- AddForeignKey
ALTER TABLE "public"."click_events" ADD CONSTRAINT "click_events_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
