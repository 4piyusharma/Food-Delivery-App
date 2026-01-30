// Database connection and configuration
// This file sets up the connection to Neon Postgres using Drizzle ORM

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as schema from './schema';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create the Neon SQL client
const sql = neon(databaseUrl);

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

// Export schema for use in other files
export * from './schema';

