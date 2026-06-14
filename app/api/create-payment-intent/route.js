import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { amount, username } = await request.json()

    // Get the waiter
    const { data: waiter } = await supabase
      .from('waiters')
      .select('id, stripe_account_id')
      .eq('username', username)
      .single()

    if (!waiter?.stripe_account_id) {
      return Response.json({ error: 'Waiter not set up for payments yet' }, { status: 400 })
    }

    // Create payment intent
    const platformFeePercent = 0.03
    const platformFee = Math.round(amount * 100 * platformFeePercent)
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'eur',
      transfer_data: {
        destination: waiter.stripe_account_id,
      },
      application_fee_amount: platformFee,
      metadata: {
        waiter_id: waiter.id,
        username,
        amount,
      }
    })

    return Response.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Payment intent error:', error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}