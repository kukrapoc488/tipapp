import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { email, username } = await request.json()

    // Create a Connect account for the waiter
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Create an onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/complete`,
      type: 'account_onboarding',
    })

    return Response.json({ url: accountLink.url, accountId: account.id })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}