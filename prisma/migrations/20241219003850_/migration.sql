/*
  Warnings:

  - You are about to drop the `Players` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Applications" DROP CONSTRAINT "Applications_playerId_fkey";

-- DropForeignKey
ALTER TABLE "TeamToPlayers" DROP CONSTRAINT "TeamToPlayers_playerId_fkey";

-- DropTable
DROP TABLE "Players";
