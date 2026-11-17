'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email) {
      setError('please enter your email')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setSent(true)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F7F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '40px 32px', width: '100%', maxWidth: '360px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a', marginBottom: '6px' }}>forgot your password?</h1>

        {sent ? (
          <p style={{ fontSize: '14px', color: '#666', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
            if an account exists for {email}, a reset link is on its way. check your inbox, and your spam folder just in case.
          </p>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '24px' }}>
              enter your email and we will send you a link to choose a new one
            </p>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #e8e8e8', borderRadius: '10px', padding: '10px 14px', fontSize: '14px', fontFamily: 'system-ui, sans-serif', color: '#333', marginBottom: '10px', outline: 'none', boxSizing: 'border-box' }}
            />
            {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px', fontFamily: 'system-ui, sans-serif' }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', background: loading ? '#aaa' : '#1D9E75', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 0', fontSize: '15px', fontFamily: 'system-ui, sans-serif', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: '16px' }}
            >
              {loading ? 'sending...' : 'send reset link'}
            </button>
          </>
        )}

        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
          <a href="/login" style={{ color: '#1D9E75', textDecoration: 'none' }}>back to log in</a>
        </p>
      </div>
    </main>
  )
}
