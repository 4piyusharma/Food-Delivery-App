# Food Delivery App - Order Management System

A full-stack food delivery order management application built with Next.js, Drizzle ORM, and Neon Postgres.

## Features

- 🍕 **Menu Display**: Browse available food items with descriptions, prices, and images
- 🛒 **Shopping Cart**: Add items to cart, adjust quantities, and manage your order
- 📝 **Order Placement**: Place orders with delivery details (name, address, phone)
- 📊 **Order Status Tracking**: Real-time order status updates (Order Received → Preparing → Out for Delivery → Delivered)
- 🔄 **Real-Time Updates**: Automatic status polling every 3 seconds
- 🧪 **Test-Driven Development**: Comprehensive test suite for API endpoints

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon Postgres (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js 18+ installed
- A Neon Postgres database account (free tier available at https://neon.tech)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Create a free account at [Neon Tech](https://neon.tech)
2. Create a new project and database
3. Copy your connection string from the Neon dashboard

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@hostname.neon.tech/dbname?sslmode=require
```

**Note**: Replace the connection string with your actual Neon database connection string.

### 4. Set Up Database Schema

Push the database schema to your Neon database:

```bash
npm run db:push
```

This will create the following tables:
- `menu_items` - Stores food items
- `orders` - Stores order information
- `order_items` - Stores items in each order

### 5. Seed the Database (Optional)

Add sample menu items to your database:

```bash
npm run db:seed
```

This will add 6 sample food items (pizzas, burgers, salads, etc.) to your database.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
food-delivery-app/
├── app/
│   ├── api/
│   │   ├── menu/
│   │   │   └── route.ts          # GET /api/menu
│   │   └── orders/
│   │       ├── route.ts          # POST /api/orders, GET /api/orders
│   │       └── [id]/
│   │           ├── route.ts      # GET /api/orders/[id]
│   │           └── status/
│   │               └── route.ts  # PATCH /api/orders/[id]/status
│   ├── components/
│   │   ├── Menu.tsx              # Menu display component
│   │   ├── Cart.tsx              # Shopping cart component
│   │   ├── Checkout.tsx          # Checkout form component
│   │   └── OrderStatus.tsx       # Order status tracking component
│   └── page.tsx                  # Main page component
├── db/
│   ├── schema.ts                 # Database schema definitions
│   └── index.ts                  # Database connection
├── scripts/
│   └── seed.ts                   # Database seeding script
├── __tests__/
│   └── api/                      # API endpoint tests
├── drizzle.config.ts             # Drizzle ORM configuration
└── package.json
```

## API Endpoints

### Menu

- **GET** `/api/menu` - Get all menu items

### Orders

- **POST** `/api/orders` - Create a new order
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

- **GET** `/api/orders` - Get all orders

- **GET** `/api/orders/[id]` - Get a specific order by ID

- **PATCH** `/api/orders/[id]/status` - Update order status
  ```json
  {
    "status": "Preparing"
  }
  ```
  
  Valid statuses: `Order Received`, `Preparing`, `Out for Delivery`, `Delivered`

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test:watch
```

## Database Commands

- `npm run db:generate` - Generate migration files
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## How to Use

1. **Browse Menu**: View available food items on the main page
2. **Add to Cart**: Click "Add to Cart" on any item (adjust quantity first if needed)
3. **Manage Cart**: Update quantities or remove items from the cart sidebar
4. **Checkout**: Click "Proceed to Checkout" and enter your delivery details
5. **Track Order**: After placing an order, view the order status page with real-time updates

## Simulating Order Status Updates

To test real-time order status updates, you can manually update an order's status using the API:

```bash
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Preparing"}'
```

The order status page will automatically update every 3 seconds.

## Understanding the Code

### Database Schema (`db/schema.ts`)

- **menuItems**: Stores food items with name, description, price, and image URL
- **orders**: Stores order information including customer details and status
- **orderItems**: Links orders to menu items with quantities

### API Routes (`app/api/`)

- Each route file exports async functions (GET, POST, PATCH) that handle HTTP requests
- Routes use Drizzle ORM to interact with the database
- Error handling and validation are included

### Components (`app/components/`)

- **Menu**: Fetches and displays menu items, handles adding to cart
- **Cart**: Manages cart state, quantity updates, removal
- **Checkout**: Form for delivery details, submits order to API
- **OrderStatus**: Displays order status with polling for updates

### Real-Time Updates

The `OrderStatus` component uses `useEffect` with `setInterval` to poll the API every 3 seconds. In a production app, you would use WebSockets for true real-time updates.

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` in `.env.local` is correct
- Ensure your Neon database is active (free tier databases sleep after inactivity)
- Check that SSL mode is enabled (`?sslmode=require`)

### Migration Issues

- If tables already exist, use `npm run db:push` instead of migrations
- Check Drizzle Studio with `npm run db:studio` to inspect your database

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run lint`

## Next Steps

- Add user authentication
- Implement WebSockets for true real-time updates
- Add payment processing
- Create admin dashboard for managing orders
- Add order history for users
- Implement search and filtering for menu items

## License

This project is created for educational purposes as part of a Full Stack Developer assessment.
