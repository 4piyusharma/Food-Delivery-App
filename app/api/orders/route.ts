// API Route: POST /api/orders
// Creates a new order with customer details and order items

import { NextResponse } from 'next/server';
import { db, orders, orderItems, menuItems } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { customerName, address, phoneNumber, items } = body;
    
    if (!customerName || !address || !phoneNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData = [];

    // Validate items and calculate total
    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { success: false, error: 'Invalid order items' },
          { status: 400 }
        );
      }

      // Fetch menu item to get current price
      const menuItem = await db.select()
        .from(menuItems)
        .where(eq(menuItems.id, item.menuItemId))
        .limit(1);

      if (menuItem.length === 0) {
        return NextResponse.json(
          { success: false, error: `Menu item with id ${item.menuItemId} not found` },
          { status: 404 }
        );
      }

      const price = parseFloat(menuItem[0].price);
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;

      orderItemsData.push({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: menuItem[0].price,
      });
    }

    // Create order
    const [newOrder] = await db.insert(orders)
      .values({
        customerName,
        address,
        phoneNumber,
        totalAmount: totalAmount.toString(),
        status: 'Order Received',
      })
      .returning();

    // Create order items
    const insertedOrderItems = await db.insert(orderItems)
      .values(
        orderItemsData.map(item => ({
          orderId: newOrder.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: item.price,
        }))
      )
      .returning();

    // Fetch full order details with menu items
    const orderWithItems = await db.select({
      order: orders,
      orderItem: orderItems,
      menuItem: menuItems,
    })
      .from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
      .where(eq(orders.id, newOrder.id));

    return NextResponse.json({
      success: true,
      data: {
        ...newOrder,
        items: orderWithItems.map(row => ({
          id: row.orderItem.id,
          menuItem: row.menuItem,
          quantity: row.orderItem.quantity,
          price: row.orderItem.price,
        })),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Get all orders or filter by phone number
// Query params: ?phoneNumber=xxx to filter by phone number
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');

    let allOrders;

    if (phoneNumber) {
      // Filter orders by phone number
      allOrders = await db.select({
        order: orders,
        orderItem: orderItems,
        menuItem: menuItems,
      })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
        .where(eq(orders.phoneNumber, phoneNumber));
    } else {
      // Get all orders (for admin/testing purposes)
      allOrders = await db.select({
        order: orders,
        orderItem: orderItems,
        menuItem: menuItems,
      })
        .from(orders)
        .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
        .leftJoin(menuItems, eq(orderItems.menuItemId, menuItems.id));
    }

    // Group order items by order
    const ordersMap = new Map();
    
    allOrders.forEach(row => {
      if (!ordersMap.has(row.order.id)) {
        ordersMap.set(row.order.id, {
          ...row.order,
          items: [],
        });
      }
      
      if (row.orderItem && row.menuItem) {
        ordersMap.get(row.order.id).items.push({
          id: row.orderItem.id,
          menuItem: row.menuItem,
          quantity: row.orderItem.quantity,
          price: row.orderItem.price,
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: Array.from(ordersMap.values()),
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

