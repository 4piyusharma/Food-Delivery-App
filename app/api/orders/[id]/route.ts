// API Route: GET /api/orders/[id]
// Get a specific order by ID

import { NextResponse } from 'next/server';
import { db, orders, orderItems, menuItems } from '@/db';
import { eq } from 'drizzle-orm';

// Note: In Next.js 16 App Router, `params` is a Promise and must be awaited.
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    // Fetch order
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Fetch order items with menu item details
    const orderWithItems = await db.select({
      orderItem: orderItems,
      menuItem: menuItems,
    })
      .from(orderItems)
      .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(eq(orderItems.orderId, orderId));

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        items: orderWithItems.map(row => ({
          id: row.orderItem.id,
          menuItem: row.menuItem,
          quantity: row.orderItem.quantity,
          price: row.orderItem.price,
        })),
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

