// API Route: GET /api/menu
// Returns all menu items available for ordering

import { NextResponse } from 'next/server';
import { db, menuItems } from '@/db';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch all menu items from the database
    const items = await db.select().from(menuItems);
    
    return NextResponse.json({ 
      success: true, 
      data: items 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

