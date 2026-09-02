import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_UDZYPibV5vH6@ep-delicate-lab-axvbhiqj-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

async function seed() {
  await sql`DROP TABLE IF EXISTS products`;
  console.log('Old table dropped.');

  await sql`CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT DEFAULT 'Shop.co',
    price TEXT NOT NULL,
    original_price TEXT,
    discount TEXT,
    rating NUMERIC(2,1) DEFAULT 4.5,
    description TEXT,
    image TEXT,
    category TEXT
  )`;
  console.log('Table schema recreated');

  const products = [
    { slug:'t-shirt-with-tape-details', name:'T-shirt with Tape Details', price:'$120', original_price:null, discount:null, rating:4.5, description:'A premium T-shirt with tape details.', image:'/Images/p1.png', category:'new-arrivals' },
    { slug:'skinny-fit-jeans', name:'Skinny Fit Jeans', price:'$240', original_price:'$260', discount:null, rating:3.5, description:'Classic skinny fit jeans from stretch denim.', image:'/Images/p2.png', category:'new-arrivals' },
    { slug:'checkered-shirt', name:'Checkered Shirt', price:'$180', original_price:null, discount:null, rating:4.5, description:'A timeless checkered shirt from soft cotton.', image:'/Images/p3.png', category:'new-arrivals' },
    { slug:'sleeve-striped-t-shirt', name:'Sleeve Striped T-shirt', price:'$130', original_price:'$160', discount:'-20%', rating:4.5, description:'A sporty striped T-shirt with contrast sleeve.', image:'/Images/p4.png', category:'new-arrivals' },
    { slug:'vertical-striped-shirt', name:'Vertical Striped Shirt', price:'$212', original_price:'$232', discount:'-20%', rating:5.0, description:'Sophisticated vertical-striped shirt, slim fit.', image:'/Images/t1.png', category:'top-selling' },
    { slug:'courage-graphic-t-shirt', name:'Courage Graphic T-shirt', price:'$145', original_price:null, discount:null, rating:4.0, description:'Bold graphic T-shirt with Courage print.', image:'/Images/t2.png', category:'top-selling' },
    { slug:'loose-fit-bermuda-shorts', name:'Loose Fit Bermuda Shorts', price:'$80', original_price:null, discount:null, rating:3.0, description:'Relaxed Bermuda shorts with side pockets.', image:'/Images/t3.png', category:'top-selling' },
    { slug:'faded-skinny-jeans', name:'Faded Skinny Jeans', price:'$210', original_price:null, discount:null, rating:4.5, description:'Trendy faded-wash skinny jeans.', image:'/Images/t4.png', category:'top-selling' },
  ];

  for (const p of products) {
    await sql`INSERT INTO products (slug, name, brand, price, original_price, discount, rating, description, image, category)
      VALUES (${p.slug}, ${p.name}, 'Shop.co', ${p.price}, ${p.original_price}, ${p.discount}, ${p.rating}, ${p.description}, ${p.image}, ${p.category})`;
    console.log('Inserted original:', p.slug);
  }
  console.log('Seeding complete! Only original 8 products exist in the database.');
}

seed().catch(e => { console.error(e); process.exit(1); });
