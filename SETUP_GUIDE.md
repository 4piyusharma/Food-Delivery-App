# Step-by-Step Setup Guide for Beginners

This guide will walk you through setting up the Food Delivery App from scratch.

## Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download and install the LTS (Long Term Support) version
3. Verify installation by opening a terminal and running:
   ```bash
   node --version
   npm --version
   ```

## Step 2: Set Up Neon Postgres Database

1. Go to https://neon.tech and create a free account
2. Click "Create Project"
3. Give your project a name (e.g., "food-delivery-app")
4. Select a region close to you
5. Click "Create Project"
6. Once created, you'll see a connection string that looks like:
   ```
   postgresql://username:password@hostname.neon.tech/dbname?sslmode=require
   ```
7. **Copy this connection string** - you'll need it in the next step

## Step 3: Configure the Project

1. Navigate to your project folder:
   ```bash
   cd food-delivery-app
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   - On Windows: Right-click in the folder → New → Text Document → Name it `.env.local`
   - On Mac/Linux: Run `touch .env.local` in terminal

4. Open `.env.local` and add your database connection string:
   ```
   DATABASE_URL=postgresql://username:password@hostname.neon.tech/dbname?sslmode=require
   ```
   **Replace the entire string with your actual Neon connection string**

## Step 4: Set Up the Database Tables

Run this command to create the database tables:
```bash
npm run db:push
```

You should see output like:
```
✓ Schema pushed to database successfully
```

## Step 5: Add Sample Menu Items

Run this command to add sample food items to your database:
```bash
npm run db:seed
```

You should see:
```
Seeding database with sample menu items...
Added: Margherita Pizza
Added: Pepperoni Pizza
...
✅ Database seeded successfully!
```

## Step 6: Start the Development Server

Run:
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
```

Open your browser and go to: **http://localhost:3000**

## Step 7: Test the Application

1. **Browse the Menu**: You should see 6 food items (pizzas, burgers, salads, etc.)
2. **Add Items to Cart**: Click the quantity buttons (+/-) and then "Add to Cart"
3. **View Cart**: Check your cart in the right sidebar
4. **Checkout**: Click "Proceed to Checkout" and fill in:
   - Name: Your name
   - Address: Any address
   - Phone: Any phone number
5. **Place Order**: Click "Place Order"
6. **View Order Status**: You'll see the order status page

## Step 8: Test Order Status Updates (Optional)

To simulate order status changes, you can use the API:

1. Note your order ID from the order status page (e.g., Order #1)
2. Open a new terminal
3. Use curl (or Postman) to update the status:

```bash
# Update to "Preparing"
curl -X PATCH http://localhost:3000/api/orders/1/status -H "Content-Type: application/json" -d "{\"status\":\"Preparing\"}"

# Update to "Out for Delivery"
curl -X PATCH http://localhost:3000/api/orders/1/status -H "Content-Type: application/json" -d "{\"status\":\"Out for Delivery\"}"

# Update to "Delivered"
curl -X PATCH http://localhost:3000/api/orders/1/status -H "Content-Type: application/json" -d "{\"status\":\"Delivered\"}"
```

The order status page will automatically update every 3 seconds!

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Make sure you created `.env.local` (not `.env`)
- Check that the file is in the root directory (same folder as `package.json`)
- Verify the connection string starts with `postgresql://`

### "Failed to connect to database"
- Check that your Neon database is active (free tier databases sleep after inactivity)
- Verify your connection string is correct
- Make sure `?sslmode=require` is at the end of your connection string

### "Cannot find module '@/db'"
- Make sure you ran `npm install`
- Check that you're in the correct directory

### Port 3000 already in use
- Stop any other applications using port 3000
- Or change the port: `npm run dev -- -p 3001`

## Understanding the Project Structure

```
food-delivery-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (backend)
│   ├── components/        # React components (frontend)
│   └── page.tsx          # Main page
├── db/                    # Database files
│   ├── schema.ts         # Database table definitions
│   └── index.ts          # Database connection
├── scripts/               # Utility scripts
│   └── seed.ts           # Script to add sample data
└── package.json          # Project dependencies

```

## Next Steps

- Read the main README.md for more details
- Explore the code in `app/components/` to understand how the UI works
- Check `app/api/` to see how the backend API works
- Try modifying the menu items in `scripts/seed.ts` and re-running `npm run db:seed`

## Need Help?

- Check the main README.md file
- Review the code comments - they explain what each part does
- Look at the test files in `__tests__/` to see examples of how the API works

