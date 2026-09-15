import { PrismaClient } from "@prisma/client"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import ws from "ws"

// Enable WebSocket constructor for Neon Serverless driver in Node.js
if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws
}

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
}

export function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  // If explicitly opted into Neon Serverless Driver Adapter or in Edge runtime
  if (connectionString && process.env.USE_NEON_ADAPTER === "true") {
    const adapter = new PrismaNeon({ connectionString })
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  }

  // Standard Prisma Client with direct or pooled PostgreSQL connection string
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

export const prisma = globalThis.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma
}

export default prisma
