# Quick Reference Guide

## Common Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Check for code errors
```

### Database
```bash
npm run db:push      # Push schema to database (creates/updates tables)
npm run db:generate  # Generate migration files
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:seed      # Add sample menu items to database
```

### Testing
```bash
npm test             # Run all tests
npm test:watch       # Run tests in watch mode
```

## Important URLs

- **Main App**: http://localhost:3000
- **Admin Page**: http://localhost:3000/admin
- **API Menu**: http://localhost:3000/api/menu
- **API Orders**: http://localhost:3000/api/orders

## Environment Variables

Create `.env.local` file:
```
DATABASE_URL=postgresql://username:password@hostname.neon.tech/dbname?sslmode=require
```

## Database Schema

### menu_items
- id (serial, primary key)
- name (varchar)
- description (text)
- price (decimal)
- image (varchar, optional)
- created_at (timestamp)

### orders
- id (serial, primary key)
- customer_name (varchar)
- address (text)
- phone_number (varchar)
- status (varchar) - 'Order Received', 'Preparing', 'Out for Delivery', 'Delivered'
- total_amount (decimal)
- created_at (timestamp)
- updated_at (timestamp)

### order_items
- id (serial, primary key)
- order_id (integer, foreign key to orders)
- menu_item_id (integer, foreign key to menu_items)
- quantity (integer)
- price (decimal)
- created_at (timestamp)

## API Endpoints Reference

### GET /api/menu
Get all menu items.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Pizza",
      "description": "Delicious pizza",
      "price": "12.99",
      "image": "https://..."
    }
  ]
}
```

### POST /api/orders
Create a new order.

**Request Body:**
```json
{
  "customerName": "John Doe",
  "address": "123 Main St",
  "phoneNumber": "123-456-7890",
  "items": [
    { "menuItemId": 1, "quantity": 2 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customerName": "John Doe",
    "status": "Order Received",
    "totalAmount": "25.98",
    "items": [...]
  }
}
```

### GET /api/orders/[id]
Get a specific order by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "customerName": "John Doe",
    "status": "Preparing",
    "items": [...]
  }
}
```

### PATCH /api/orders/[id]/status
Update order status.

**Request Body:**
```json
{
  "status": "Preparing"
}
```

**Valid Statuses:**
- "Order Received"
- "Preparing"
- "Out for Delivery"
- "Delivered"

## Troubleshooting

### Database Connection Issues
1. Check `.env.local` exists and has correct `DATABASE_URL`
2. Verify Neon database is active (wake it up if needed)
3. Ensure connection string includes `?sslmode=require`

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Tables Not Created
```bash
# Push schema again
npm run db:push

# Or check Drizzle Studio
npm run db:studio
```

## File Locations Quick Reference

- **Main Page**: `app/page.tsx`
- **Menu Component**: `app/components/Menu.tsx`
- **Cart Component**: `app/components/Cart.tsx`
- **Checkout Component**: `app/components/Checkout.tsx`
- **Order Status Component**: `app/components/OrderStatus.tsx`
- **Menu API**: `app/api/menu/route.ts`
- **Orders API**: `app/api/orders/route.ts`
- **Database Schema**: `db/schema.ts`
- **Database Connection**: `db/index.ts`
- **Seed Script**: `scripts/seed.ts`

## Next Steps After Setup

1. ✅ Set up database (Neon Postgres)
2. ✅ Configure `.env.local`
3. ✅ Run `npm run db:push`
4. ✅ Run `npm run db:seed`
5. ✅ Start dev server: `npm run dev`
6. ✅ Test the app: Browse menu → Add to cart → Checkout
7. ✅ Test admin page: http://localhost:3000/admin
8. ✅ Update order status and watch it update in real-time!

