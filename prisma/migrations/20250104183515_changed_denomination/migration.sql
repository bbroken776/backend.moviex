/*
  Warnings:

  - You are about to drop the column `bannerB` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the column `posterB` on the `movies` table. All the data in the column will be lost.
  - Added the required column `banner` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poster` to the `movies` table without a default value. This is not possible if the table is not empty.

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
    "poster" BLOB NOT NULL,
    "banner" BLOB NOT NULL,
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
