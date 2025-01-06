/*
  Warnings:

  - You are about to drop the column `banner` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `poster` on the `movies` table. All the data in the column will be lost.
  - Added the required column `bannerB` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posterB` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_movies" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genres" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "posterB" BLOB NOT NULL,
    "bannerB" BLOB NOT NULL,
    "source" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_movies" ("createdAt", "description", "duration", "genres", "id", "likes", "source", "title", "updatedAt", "year") SELECT "createdAt", "description", "duration", "genres", "id", "likes", "source", "title", "updatedAt", "year" FROM "movies";
DROP TABLE "movies";
ALTER TABLE "new_movies" RENAME TO "movies";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
