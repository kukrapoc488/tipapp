'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ResetPassword() {
  const [ready, setReady] = useState(false)
  const [checked, setChecked] = useState(false)
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    const timer = setTimeout(() => setChecked(true), 3000)
    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async () => {
    if (password.length < 6) {
      setError('password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    setDone(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 2000)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F7F5F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Georgia, serif', padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '24px', padding: '40px 32px', width: '100%', maxWidth: '360px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a', marginBottom: '6px' }}>choose a new password</h1>

        {done ? (
          <p style={{ fontSize: '14px', color: '#0F6E56', fontFamily: 'system-ui, sans-serif' }}>password updated, taking you to your dashboard...</p>
        ) : ready ? (
          <>
            <p style={{ fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '24px' }}>at least 6 characters</p>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input
                type={show ? 'text' : 'password'}
                placeholder="new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #e8e8e8', borderRadius: '10px', padding: '10px 54px 10px 14px', fontSize: '14px', fontFamily: 'system-ui, sans-serif', color: '#333', outline: 'none', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#1D9E75', fontSize: '12px', fontFamily: 'system-ui, sans-serif', cursor: 'pointer' }}
              >
                {show ? 'hide' : 'show'}
              </button>
            </div>
            {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px', fontFamily: 'system-ui, sans-serif' }}>{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', background: loading ? '#aaa' : '#1D9E75', color: '#fff', border: 'none', borderRadius: '12px', padding: '14px 0', fontSize: '15px', fontFamily: 'system-ui, sans-serif', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'saving...' : 'save new password'}
            </button>
          </>
        ) : checked ? (
          <p style={{ fontSize: '14px', color: '#666', fontFamily: 'system-ui, sans-serif', lineHeight: 1.6 }}>
            this link is invalid or has expired. <a href="/forgot-password" style={{ color: '#1D9E75', textDecoration: 'none' }}>request a new one</a>
          </p>
        ) : (
          <p style={{ fontSize: '14px', color: '#999', fontFamily: 'system-ui, sans-serif' }}>checking your link...</p>
        )}
      </div>
    </main>
  )
}
