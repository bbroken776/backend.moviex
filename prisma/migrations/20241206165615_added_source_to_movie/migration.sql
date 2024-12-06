/*
  Warnings:

  - Added the required column `source` to the `movies` table without a default value. This is not possible if the table is not empty.

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
    "poster" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_movies" ("banner", "createdAt", "description", "duration", "genres", "id", "likes", "poster", "title", "updatedAt", "year") SELECT "banner", "createdAt", "description", "duration", "genres", "id", "likes", "poster", "title", "updatedAt", "year" FROM "movies";
DROP TABLE "movies";
ALTER TABLE "new_movies" RENAME TO "movies";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;