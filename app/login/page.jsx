'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
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
          welcome back
        </h1>
        <p style={{ fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '24px' }}>
          log in to see your tips and QR code
        </p>

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

        <button
          onClick={handleLogin}
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
            marginBottom: '16px'
          }}
        >
          {loading ? 'logging in...' : 'log in →'}
        </button>

        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          no account yet?{' '}
          <a href="/signup" style={{ color: '#1D9E75', textDecoration: 'none' }}>sign up</a>
        </p>
      </div>
    </main>
  )
}