// Database connection and configuration
// This file sets up the connection to Neon Postgres using Drizzle ORM

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as schema from './schema';

// Load environment variables (only in development/local)
// Vercel automatically provides environment variables, so we don't need dotenv there
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  dotenv.config({ path: '.env.local' });
}

// Lazy initialization of database connection
// This prevents errors during build time when DATABASE_URL might not be available
let _db: ReturnType<typeof drizzle> | null = null;

function getDatabase() {
  if (_db) {
    return _db;
  }

  // Get database URL from environment variables
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Only throw error if we're actually trying to use the database
    // This allows the build to complete even if DATABASE_URL is not set
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Create the Neon SQL client
  const sql = neon(databaseUrl);

  // Create the Drizzle database instance
  _db = drizzle(sql, { schema });
  
  return _db;
}

// Export db with lazy initialization
// The connection is only established when db methods are actually called
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    const dbInstance = getDatabase();
    const value = dbInstance[prop as keyof typeof dbInstance];
    if (typeof value === 'function') {
      return value.bind(dbInstance);
    }
    return value;
  }
}) as ReturnType<typeof drizzle>;

// Export schema for use in other files
export * from './schema';

