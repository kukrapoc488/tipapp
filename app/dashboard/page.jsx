'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { QRCodeCanvas } from 'qrcode.react'

export default function Dashboard() {
  const [waiter, setWaiter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tips, setTips] = useState([])
  const [copied, setCopied] = useState(false)


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

      const { data: tipsData } = await supabase
        .from('tips')
        .select('*')
        .eq('waiter_id', data.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setWaiter(data)
      setTips(tipsData || [])
      setLoading(false)
    }
    getWaiter()
  }, [])

  const downloadQR = () => {
    const canvas = document.querySelector('#qr-code-canvas')
    if (!canvas) return

    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `${waiter.username}-tip-qr.png`
    link.click()
  }

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
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '22px', fontWeight: '500', color: '#1D9E75', margin: '0 0 2px' }}>
              €{tips.reduce((sum, t) => sum + t.amount, 0)}
            </p>
            <p style={{ fontSize: '11px', color: '#999', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
              total earned
            </p>
          </div>
          <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a', margin: '0 0 2px' }}>
              {tips.length}
            </p>
            <p style={{ fontSize: '11px', color: '#999', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
              total tips
            </p>
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: '24px', padding: '32px', textAlign: 'center', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            your tip QR code
          </p>
          <div style={{ display: 'inline-block', padding: '16px', background: '#fff', borderRadius: '12px', border: '1.5px solid #f0f0f0' }}>
  <QRCodeCanvas id="qr-code-canvas" value={profileUrl} size={600} style={{ width: '160px', height: '160px' }} />
</div>
          <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', marginTop: '16px', marginBottom: '4px' }}>
            {profileUrl}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
          <button
  onClick={() => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }}
  style={{ background: copied ? '#1D9E75' : '#F7F5F0', border: 'none', borderRadius: '8px', color: copied ? '#fff' : '#333', fontSize: '12px', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', padding: '8px 14px' }}
>
  {copied ? 'copied!' : 'copy link'}
</button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent('Tip me directly here: ' + profileUrl)}`}
              target="_blank"
              rel="noreferrer"
              style={{ background: '#25D366', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', padding: '8px 14px', textDecoration: 'none' }}
            >
              share on WhatsApp
            </a>
          </div>
          <button
            onClick={downloadQR}
            style={{ display: 'block', margin: '10px auto 0', background: 'none', border: 'none', color: '#999', fontSize: '12px', fontFamily: 'system-ui, sans-serif', cursor: 'pointer', textDecoration: 'underline' }}
          >
            download QR code
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

        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', marginTop: '16px' }}>
          <p style={{ fontSize: '12px', color: '#999', fontFamily: 'system-ui, sans-serif', marginBottom: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            recent tips
          </p>
          {tips.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#bbb', fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '16px 0' }}>
              no tips yet — share your QR code!
            </p>
          ) : (
            tips.map((tip) => (
              <div key={tip.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#1a1a1a', fontFamily: 'system-ui, sans-serif', margin: '0 0 2px' }}>
                    anonymous guest
                  </p>
                  <p style={{ fontSize: '11px', color: '#bbb', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                    {new Date(tip.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p style={{ fontSize: '15px', fontWeight: '500', color: '#1D9E75', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
                  +€{tip.amount}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  )
}
