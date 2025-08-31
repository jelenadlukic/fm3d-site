/*
  Warnings:

  - You are about to drop the column `authorId` on the `Work` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BadgeReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workId" TEXT NOT NULL,
    "giverUserId" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "note" TEXT,
    CONSTRAINT "BadgeReview_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BadgeReview_giverUserId_fkey" FOREIGN KEY ("giverUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "text" TEXT NOT NULL,
    "attachmentPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "passwordHash" TEXT,
    "bio" TEXT,
    "avatarPath" TEXT,
    "avatarUrl" TEXT
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "name", "passwordHash", "role") SELECT "email", "emailVerified", "id", "image", "name", "passwordHash", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "description" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "coverPath" TEXT,
    "coverUrl" TEXT,
    "filePath" TEXT,
    "mediaType" TEXT NOT NULL DEFAULT 'IMAGE',
    "authorUserId" TEXT,
    CONSTRAINT "Work_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Work" ("coverPath", "coverUrl", "createdAt", "description", "excerpt", "filePath", "id", "mediaType", "published", "slug", "title", "updatedAt") SELECT "coverPath", "coverUrl", "createdAt", "description", "excerpt", "filePath", "id", "mediaType", "published", "slug", "title", "updatedAt" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
CREATE UNIQUE INDEX "Work_slug_key" ON "Work"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BadgeReview_workId_giverUserId_badge_key" ON "BadgeReview"("workId", "giverUserId", "badge");

-- CreateIndex
CREATE UNIQUE INDEX "JournalEntry_userId_date_key" ON "JournalEntry"("userId", "date");
