import { NextRequest, NextResponse } from 'next/server'
import getDb from '@/lib/db'

// GET /api/user — fetch demo user (id = 1)
export async function GET() {
  try {
    const sql = getDb()
    const rows = await sql`SELECT * FROM users WHERE id = 1 LIMIT 1`
    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json(rows[0])
  } catch (error: any) {
    console.error('GET /api/user error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT /api/user — update demo user (id = 1)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      state,
      zip,
      newsletter_subscribed,
      sms_notifications,
    } = body

    const sql = getDb()
    await sql`
      UPDATE users SET
        first_name = ${first_name ?? ''},
        last_name = ${last_name ?? ''},
        email = ${email ?? ''},
        phone = ${phone ?? ''},
        address = ${address ?? ''},
        city = ${city ?? ''},
        state = ${state ?? ''},
        zip = ${zip ?? ''},
        newsletter_subscribed = ${newsletter_subscribed ?? true},
        sms_notifications = ${sms_notifications ?? false},
        updated_at = NOW()
      WHERE id = 1
    `
    return NextResponse.json({ success: true, message: 'Profile updated.' })
  } catch (error: any) {
    console.error('PUT /api/user error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
