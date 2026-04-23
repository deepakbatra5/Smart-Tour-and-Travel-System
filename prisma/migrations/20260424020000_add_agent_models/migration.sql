-- Add missing Agent-related enums and tables for production databases
-- that were created from the initial migration only.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AgentStatus') THEN
    CREATE TYPE "AgentStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AssignmentStatus') THEN
    CREATE TYPE "AssignmentStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Agent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "experience" INTEGER NOT NULL,
  "languages" TEXT[],
  "bio" TEXT,
  "status" "AgentStatus" NOT NULL DEFAULT 'PENDING',
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalTours" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AgentTourPreference" (
  "id" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "packageId" TEXT NOT NULL,
  CONSTRAINT "AgentTourPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "BookingAgent" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "commission" DOUBLE PRECISION NOT NULL,
  "status" "AssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
  "rating" INTEGER,
  "feedback" TEXT,
  "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "BookingAgent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Agent_userId_key" ON "Agent"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "AgentTourPreference_agentId_packageId_key" ON "AgentTourPreference"("agentId", "packageId");
CREATE UNIQUE INDEX IF NOT EXISTS "BookingAgent_bookingId_key" ON "BookingAgent"("bookingId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Agent_userId_fkey'
  ) THEN
    ALTER TABLE "Agent"
      ADD CONSTRAINT "Agent_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AgentTourPreference_agentId_fkey'
  ) THEN
    ALTER TABLE "AgentTourPreference"
      ADD CONSTRAINT "AgentTourPreference_agentId_fkey"
      FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AgentTourPreference_packageId_fkey'
  ) THEN
    ALTER TABLE "AgentTourPreference"
      ADD CONSTRAINT "AgentTourPreference_packageId_fkey"
      FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BookingAgent_bookingId_fkey'
  ) THEN
    ALTER TABLE "BookingAgent"
      ADD CONSTRAINT "BookingAgent_bookingId_fkey"
      FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BookingAgent_agentId_fkey'
  ) THEN
    ALTER TABLE "BookingAgent"
      ADD CONSTRAINT "BookingAgent_agentId_fkey"
      FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
