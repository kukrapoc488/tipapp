'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { QRCodeSVG } from 'qrcode.react'

export default function Dashboard() {
  const [waiter, setWaiter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getWaiter = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      const { data } = await supabase
        .from('waiters')
        .select('*')
        .eq('user_id', user.id)
        .single()
      setWaiter(data)
      setLoading(false)
    }
    getWaiter()
  }, [])

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999', fontFamily: 'system-ui, sans-serif' }}>loading...</p>
      </main>
    )
  }

  if (!waiter) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999', fontFamily: 'system-ui, sans-serif' }}>no profile found</p>
      </main>
    )
  }

  const profileUrl = typeof window !== 'undefined' ? window.location.origin + '/' + waiter.username : ''
  const initials = waiter.full_name.split(' ').map((n) => n[0]).join('')

  return (
    <main style={{ minHeight: '100vh', background: '#F7F5F0', fontFamily: 'Georgia, serif', padding: '24px' }}>
      <div style={{ maxWidth: '360px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a', margin: '0 0 2px' }}>
              hey {waiter.full_name.split(' ')[0]}
            </h1>
            <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
              {waiter.restaurant}
            </p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8F5F0', color: '#0F6E56', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {initials}
          </div>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#999',
            fontSize: '12px',
            fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer',
            marginBottom: '16px',
            padding: 0
          }}
        >
          log out
        </button>

        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            your tip QR code
          </p>
          <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '12px', border: '1.5px solid #f0f0f0' }}>
            <QRCodeSVG value={profileUrl} size={160} />
          </div>
          <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', marginTop: '16px', marginBottom: '4px' }}>
            {profileUrl}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(profileUrl)}
            style={{ background: 'none', border: 'none', color: '#1D9E75', fontSize: '12px', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', padding: '4px 0' }}
          >
            copy link
          </button>
        </div>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a1a', margin: '0 0 2px' }}>your profile</p>
            <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', margin: 0 }}>/{waiter.username}</p>
          </div>
          <a
            href={'/' + waiter.username}
            target="_blank"
            rel="noreferrer"
            style={{ background: '#1D9E75', color: '#fff', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontFamily: 'system-ui, sans-serif', textDecoration: 'none' }}
          >
            view
          </a>
        </div>
      </div>
    </main>
  )
}
