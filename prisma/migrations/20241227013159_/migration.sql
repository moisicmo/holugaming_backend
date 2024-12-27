-- CreateEnum
CREATE TYPE "Phase_type" AS ENUM ('ROUND_ROBIN', 'kNOcKOUT');

-- CreateEnum
CREATE TYPE "Game_type" AS ENUM ('MOVA', 'STRATEGIC');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CAPTAIN', 'PLAYER', 'SUBSTITUTE');

-- CreateTable
CREATE TABLE "Games" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "Game_type" NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teams" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "shieldUrl" VARCHAR(255),
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamToPlayers" (
    "teamId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CAPTAIN',
    "nick" VARCHAR(255) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tournaments" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "numberTeams" INTEGER NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "inscriptionCost" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "playerCount" INTEGER NOT NULL,
    "substituteCount" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phases" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phaseType" "Phase_type" NOT NULL,
    "matchDefinition" INTEGER NOT NULL,
    "teamsInput" INTEGER NOT NULL,
    "teamsOutput" INTEGER NOT NULL,
    "start" DATE NOT NULL,
    "end" DATE NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matches" (
    "id" SERIAL NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "schedule" DATE NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportMatches" (
    "id" SERIAL NOT NULL,
    "matchId" INTEGER NOT NULL,
    "rezon" VARCHAR(255) NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportMatches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchToTeams" (
    "matchId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Inscriptions" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "isPayment" BOOLEAN NOT NULL DEFAULT false,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamToPlayers_teamId_playerId_key" ON "TeamToPlayers"("teamId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchToTeams_matchId_teamId_key" ON "MatchToTeams"("matchId", "teamId");

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teams" ADD CONSTRAINT "Teams_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamToPlayers" ADD CONSTRAINT "TeamToPlayers_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournaments" ADD CONSTRAINT "Tournaments_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phases" ADD CONSTRAINT "Phases_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Matches" ADD CONSTRAINT "Matches_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportMatches" ADD CONSTRAINT "ReportMatches_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchToTeams" ADD CONSTRAINT "MatchToTeams_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchToTeams" ADD CONSTRAINT "MatchToTeams_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscriptions" ADD CONSTRAINT "Inscriptions_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
