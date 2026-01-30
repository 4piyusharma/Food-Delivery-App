// Tests for Orders API endpoint
// Tests order creation, validation, and retrieval

import { NextRequest } from 'next/server';
import { POST, GET } from '@/app/api/orders/route';

// Mock the database
jest.mock('@/db', () => ({
  db: {
    insert: jest.fn(),
    select: jest.fn(),
  },
  orders: {},
  orderItems: {},
  menuItems: {},
}));

describe('/api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    const mockOrderData = {
      customerName: 'John Doe',
      address: '123 Main St',
      phoneNumber: '123-456-7890',
      items: [
        { menuItemId: 1, quantity: 2 },
      ],
    };

    const mockMenuItem = {
      id: 1,
      name: 'Pizza',
      price: '12.99',
    };

    const { db } = require('@/db');
    
    // Mock menu item fetch
    db.select.mockReturnValueOnce({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([mockMenuItem]),
        }),
      }),
    });

    // Mock order insert
    db.insert.mockReturnValueOnce({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 1, ...mockOrderData }]),
      }),
    });

    // Mock order items insert
    db.insert.mockReturnValueOnce({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue([{ id: 1, orderId: 1, menuItemId: 1, quantity: 2 }]),
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      body: JSON.stringify(mockOrderData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });

  it('should reject order with missing fields', async () => {
    const invalidOrderData = {
      customerName: 'John Doe',
      // Missing address and phoneNumber
      items: [],
    };

    const request = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      body: JSON.stringify(invalidOrderData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Missing required fields');
  });

  it('should reject order with empty items', async () => {
    const invalidOrderData = {
      customerName: 'John Doe',
      address: '123 Main St',
      phoneNumber: '123-456-7890',
      items: [],
    };

    const request = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      body: JSON.stringify(invalidOrderData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });
});

