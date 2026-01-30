// API Route: PATCH /api/orders/[id]/status
// Update the status of an order (for simulating real-time updates)

import { NextResponse } from 'next/server';
import { db, orders } from '@/db';
import { eq } from 'drizzle-orm';

const validStatuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

// Note: In Next.js 16 App Router, `params` is a Promise and must be awaited.
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status } = body;

    if (isNaN(orderId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update order status
    const [updatedOrder] = await db.update(orders)
      .set({ 
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

