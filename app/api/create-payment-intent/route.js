import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  try {
    const { amount } = await request.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: 'eur',
    })

    return Response.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}