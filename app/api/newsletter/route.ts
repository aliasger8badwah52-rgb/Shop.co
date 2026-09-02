import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }
  const resend = new Resend(apiKey)

  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Send welcome email to the user
    const userEmailResponse = await resend.emails.send({
      from: 'Shop.co <onboarding@resend.dev>', // Using Resend test domain
      to: email,
      subject: 'Welcome to Shop.co!',
      html: `
        <h1>Welcome to Shop.co!</h1>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>We're excited to have you on board. You'll be the first to know about our latest offers, new arrivals, and exclusive discounts.</p>
        <br/>
        <p>Best,</p>
        <p>The Shop.co Team</p>
      `,
    })

    if (userEmailResponse.error) {
      return NextResponse.json({ error: userEmailResponse.error.message }, { status: 500 })
    }

    // Send notification email to the owner
    // Sending to a testing email or the same email since onboarding@resend.dev requires verified domains.
    // We will send to 'delivered@resend.dev' as a placeholder for owner's email, or we can send to the user's email just for testing.
    await resend.emails.send({
      from: 'Shop.co System <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // Replace with owner's email in production
      subject: 'New Newsletter Subscriber!',
      html: `
        <h2>New Subscriber Alert</h2>
        <p>A new user has just subscribed to the newsletter:</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    })

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch (error: any) {
    console.error('Newsletter error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
