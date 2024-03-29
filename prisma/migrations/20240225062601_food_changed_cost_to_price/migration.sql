/*
  Warnings:

  - You are about to drop the column `cost` on the `Food` table. All the data in the column will be lost.
  - Added the required column `price` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Food" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "categoryId" INTEGER NOT NULL,
    "statusId" INTEGER DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Food_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "FoodStatus" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Food" ("categoryId", "createdAt", "description", "id", "image", "name", "statusId", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "image", "name", "statusId", "updatedAt" FROM "Food";
DROP TABLE "Food";
ALTER TABLE "new_Food" RENAME TO "Food";
CREATE UNIQUE INDEX "Food_name_key" ON "Food"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
