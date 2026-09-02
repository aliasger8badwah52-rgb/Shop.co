import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

async function migrate() {
  const sql = neon(DATABASE_URL)

  console.log('Creating users table...')

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT DEFAULT '',
      last_name TEXT DEFAULT '',
      email TEXT UNIQUE DEFAULT '',
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      city TEXT DEFAULT '',
      state TEXT DEFAULT '',
      zip TEXT DEFAULT '',
      newsletter_subscribed BOOLEAN DEFAULT true,
      sms_notifications BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  console.log('Users table created.')

  // Insert a demo user if one doesn't exist
  const existing = await sql`SELECT id FROM users WHERE id = 1`
  if (existing.length === 0) {
    await sql`
      INSERT INTO users (first_name, last_name, email, phone, address, city, state, zip)
      VALUES ('John', 'Doe', 'john@shopco.com', '+1 (555) 123-4567', '123 Fashion Ave', 'New York', 'NY', '10001')
    `
    console.log('Demo user inserted (id=1).')
  } else {
    console.log('Demo user already exists.')
  }

  console.log('Migration complete!')
  process.exit(0)
}

migrate().catch((e) => {
  console.error(e)
  process.exit(1)
})
