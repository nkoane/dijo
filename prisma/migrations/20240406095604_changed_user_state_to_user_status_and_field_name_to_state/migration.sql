/*
  Warnings:

  - You are about to drop the `UserState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "UserState_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserState";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UserRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "User_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "UserStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "hashed_password", "id", "roleId", "stateId", "updatedAt", "username") SELECT "createdAt", "hashed_password", "id", "roleId", "stateId", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "UserStatus_state_key" ON "UserStatus"("state");
