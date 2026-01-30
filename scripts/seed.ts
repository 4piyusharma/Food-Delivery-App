// Database seeding script - adds sample menu items to the database
// Run this after setting up your database: npm run db:seed

import { db, menuItems } from '../db';

async function seed() {
  console.log('Seeding database with sample menu items...');

  const sampleMenuItems = [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: '12.99',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500',
    },
    {
      name: 'Pepperoni Pizza',
      description: 'Delicious pizza topped with pepperoni and mozzarella cheese',
      price: '14.99',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500',
    },
    {
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
      price: '9.99',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    },
    {
      name: 'Chicken Burger',
      description: 'Grilled chicken breast with mayo, lettuce, and pickles',
      price: '10.99',
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500',
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
      price: '8.99',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500',
    },
    {
      name: 'Chicken Wings',
      description: 'Crispy chicken wings with your choice of sauce (Buffalo, BBQ, or Honey Mustard)',
      price: '11.99',
      image: 'https://images.unsplash.com/photo-1527477396000-e27137b2a8b3?w=500',
    },
  ];

  try {
    // Insert sample menu items
    for (const item of sampleMenuItems) {
      await db.insert(menuItems).values(item);
      console.log(`Added: ${item.name}`);
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

