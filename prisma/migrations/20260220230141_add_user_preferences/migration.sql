-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "clerkUserID" TEXT NOT NULL,
    "lastSearchedLocation" TEXT NOT NULL,
    "placeId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_clerkUserID_key" ON "UserPreferences"("clerkUserID");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_lastSearchedLocation_key" ON "UserPreferences"("lastSearchedLocation");
