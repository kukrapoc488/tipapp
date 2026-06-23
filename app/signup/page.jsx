'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [restaurant, setRestaurant] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState('')
  const [loadingStep, setLoadingStep] = useState('')
  const [step, setStep] = useState(1)

  const checkUsername = async (value) => {
    setUsername(value)

    if (!value) {
      setUsernameStatus('')
      return
    }

    setUsernameStatus('checking')

    const { data } = await supabase
      .from('waiters')
      .select('username')
      .eq('username', value)
      .maybeSingle()

    setUsernameStatus(data ? 'taken' : 'available')
  }

  const handleSignUp = async () => {
    if (!name || !username || !restaurant || !email || !password) {
      setError('please fill in all required fields')
      return
    }

    if (usernameStatus === 'taken') {
      setError('please choose a different username')
      return
    }

    if (password.length < 6) {
      setError('password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setLoadingStep('creating your account...')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    setLoadingStep('setting up your profile...')

    // Create waiter profile
    const { error: profileError } = await supabase
      .from('waiters')
      .insert({
        username,
        full_name: name,
        restaurant,
        bio,
        user_id: data.user.id,
      })

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    setLoadingStep('almost there...')

    // Connect Stripe account
    const res = await fetch('/api/create-connect-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username })
    })
    const stripeData = await res.json()

    if (stripeData.error) {
      setError(stripeData.error)
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('waiters')
      .update({ stripe_account_id: stripeData.accountId })
      .eq('username', username)

    console.log('Stripe account ID saved:', stripeData.accountId, 'Error:', updateError)

    window.location.href = stripeData.url
  }

  const inputStyle = {
    width: '100%',
    border: '1.5px solid #e8e8e8',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    fontFamily: 'system-ui, sans-serif',
    color: '#333',
    marginBottom: '10px',
    outline: 'none',
    boxSizing: 'border-box'
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F7F5F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      padding: '24px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 2px 40px rgba(0,0,0,0.06)'
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a', marginBottom: '6px' }}>
          create your profile
        </h1>
        <p style={{ fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '24px' }}>
          guests will tip you directly via your profile page
        </p>

        <input
          type="text"
          placeholder="full name *"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="username (e.g. marco) *"
          value={username}
          onChange={e => checkUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
          style={inputStyle}
        />
        {usernameStatus === 'checking' && (
          <p style={{ fontSize: '11px', color: '#999', fontFamily: 'system-ui, sans-serif', margin: '-4px 0 10px' }}>
            checking...
          </p>
        )}
        {usernameStatus === 'taken' && (
          <p style={{ fontSize: '11px', color: 'red', fontFamily: 'system-ui, sans-serif', margin: '-4px 0 10px' }}>
            username already taken
          </p>
        )}
        {usernameStatus === 'available' && (
          <p style={{ fontSize: '11px', color: '#1D9E75', fontFamily: 'system-ui, sans-serif', margin: '-4px 0 10px' }}>
            ✓ available
          </p>
        )}
        <input
          type="text"
          placeholder="restaurant name *"
          value={restaurant}
          onChange={e => setRestaurant(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="short bio (optional)"
          value={bio}
          onChange={e => setBio(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'none' }}
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px', fontFamily: 'system-ui, sans-serif' }}>
            {error}
          </p>
        )}
<p style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', fontFamily: 'system-ui, sans-serif', marginBottom: '20px' }}>
  after this you'll securely connect your bank account via Stripe to receive tips
</p>

        <button
          onClick={handleSignUp}
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
            marginBottom: '10px'
          }}
        >
          {loading ? loadingStep : 'create profile →'}
        </button>


      </div>
    </main>
  )
}