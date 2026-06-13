'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm({ amount, waiterName }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!stripe || !elements) return
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href + '?success=true',
      },
    })

    if (error) {
      setMessage(error.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <PaymentElement />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? '#aaa' : '#1D9E75',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          padding: '14px 0',
          fontSize: '15px',
          fontFamily: 'system-ui, sans-serif',
          fontWeight: '500',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginTop: '16px',
          marginBottom: '10px'
        }}
      >
        {loading ? 'processing...' : `send €${amount} tip →`}
      </button>
      {message && <p style={{ color: 'red', fontSize: '13px', textAlign: 'center' }}>{message}</p>}
    </div>
  )
}

export default function TipForm({ waiterName, username }) {
  const [amount, setAmount] = useState(5)
  const [customAmount, setCustomAmount] = useState('')
  const [clientSecret, setClientSecret] = useState(null)
  const [step, setStep] = useState('select')
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#E8F5F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          fontSize: '22px'
        }}>
          ✓
        </div>
        <p style={{ fontSize: '18px', fontWeight: '500', color: '#1a1a1a', marginBottom: '6px' }}>tip sent!</p>
        <p style={{ fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif' }}>
          {waiterName} will receive this directly
        </p>
      </div>
    )
  }

  const selectedAmount = customAmount ? parseInt(customAmount) : amount

  const handleTip = async () => {
    if (!selectedAmount || selectedAmount < 1) return
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: selectedAmount, username })
    })
    const data = await res.json()
    setClientSecret(data.clientSecret)
    setStep('pay')
  }

  if (step === 'pay' && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm amount={selectedAmount} waiterName={waiterName} />
      </Elements>
    )
  }

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#999', margin: '0 0 12px', fontFamily: 'system-ui, sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        how much would you like to tip?
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
        {[1, 2, 5, 10].map((amt) => (
          <button key={amt} onClick={() => { setAmount(amt); setCustomAmount('') }} style={{
            background: amount === amt && !customAmount ? '#1D9E75' : '#fff',
            color: amount === amt && !customAmount ? '#fff' : '#333',
            border: amount === amt && !customAmount ? '1.5px solid #1D9E75' : '1.5px solid #e8e8e8',
            borderRadius: '10px',
            padding: '10px 0',
            fontSize: '14px',
            fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer',
            fontWeight: amount === amt && !customAmount ? '500' : '400'
          }}>
            €{amt}
          </button>
        ))}
      </div>

      <input
        type="number"
        placeholder="€ other amount"
        value={customAmount}
        onChange={e => setCustomAmount(e.target.value)}
        style={{
          width: '100%',
          border: '1.5px solid #e8e8e8',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '14px',
          fontFamily: 'system-ui, sans-serif',
          color: '#333',
          marginBottom: '12px',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />

      <button onClick={handleTip} style={{
        width: '100%',
        background: '#1D9E75',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '14px 0',
        fontSize: '15px',
        fontFamily: 'system-ui, sans-serif',
        fontWeight: '500',
        cursor: 'pointer',
        marginBottom: '10px'
      }}>
        tip €{selectedAmount} →
      </button>

      <p style={{ fontSize: '11px', color: '#bbb', fontFamily: 'system-ui, sans-serif' }}>
        goes directly to {waiterName} · secured by Stripe
      </p>
    </div>
  )
}