-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Poll" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team1Name" TEXT NOT NULL,
    "team2Name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "team1Votes" INTEGER NOT NULL DEFAULT 0,
    "team2Votes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Poll" ("createdAt", "id", "startTime", "team1Name", "team1Votes", "team2Name", "team2Votes", "updatedAt") SELECT "createdAt", "id", "startTime", "team1Name", "team1Votes", "team2Name", "team2Votes", "updatedAt" FROM "Poll";
DROP TABLE "Poll";
ALTER TABLE "new_Poll" RENAME TO "Poll";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
