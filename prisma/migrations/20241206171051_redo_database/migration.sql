/*
  Warnings:

  - You are about to drop the `_MovieToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MovieToUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_UserLikesMovie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserLikesMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "movies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserLikesMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserLikesMovie_AB_unique" ON "_UserLikesMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_UserLikesMovie_B_index" ON "_UserLikesMovie"("B");
