/*
  Warnings:

  - You are about to alter the column `matchId` on the `FavoriteMatch` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `seriesId` on the `FavoriteSeries` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FavoriteMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "matchId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FavoriteMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteMatch" ("createdAt", "id", "matchId", "userId") SELECT "createdAt", "id", "matchId", "userId" FROM "FavoriteMatch";
DROP TABLE "FavoriteMatch";
ALTER TABLE "new_FavoriteMatch" RENAME TO "FavoriteMatch";
CREATE UNIQUE INDEX "FavoriteMatch_userId_matchId_key" ON "FavoriteMatch"("userId", "matchId");
CREATE TABLE "new_FavoriteSeries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "seriesId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FavoriteSeries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FavoriteSeries" ("createdAt", "id", "seriesId", "userId") SELECT "createdAt", "id", "seriesId", "userId" FROM "FavoriteSeries";
DROP TABLE "FavoriteSeries";
ALTER TABLE "new_FavoriteSeries" RENAME TO "FavoriteSeries";
CREATE UNIQUE INDEX "FavoriteSeries_userId_seriesId_key" ON "FavoriteSeries"("userId", "seriesId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
