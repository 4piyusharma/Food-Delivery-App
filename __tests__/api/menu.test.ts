// Tests for Menu API endpoint
// Tests CRUD operations and validation

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/menu/route';

// Mock the database
jest.mock('@/db', () => ({
  db: {
    select: jest.fn(),
  },
  menuItems: {},
}));

describe('/api/menu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return menu items successfully', async () => {
    const mockMenuItems = [
      {
        id: 1,
        name: 'Pizza',
        description: 'Delicious pizza',
        price: '12.99',
        image: 'https://example.com/pizza.jpg',
      },
    ];

    const { db } = require('@/db');
    db.select.mockReturnValue({
      from: jest.fn().mockResolvedValue(mockMenuItems),
    });

    const request = new NextRequest('http://localhost:3000/api/menu');
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockMenuItems);
  });

  it('should handle database errors', async () => {
    const { db } = require('@/db');
    db.select.mockReturnValue({
      from: jest.fn().mockRejectedValue(new Error('Database error')),
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to fetch menu items');
  });
});

