-- CreateTable
CREATE TABLE "Polls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team1Name" TEXT NOT NULL,
    "team2Name" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "team1Votes" INTEGER NOT NULL,
    "team2Votes" INTEGER NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
