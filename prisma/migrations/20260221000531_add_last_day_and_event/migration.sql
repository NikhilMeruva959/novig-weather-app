-- DropIndex
DROP INDEX "UserPreferences_lastSearchedLocation_key";

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "lastDayOfWeek" TEXT,
ADD COLUMN     "lastEventOfDay" TEXT;
