import { supabase } from '../../lib/supabase'
import TipForm from './TipForm'

export default async function WaiterProfile({ params }: { params: Promise<{ username: string }> }) {  const { username } = await params

  const { data: waiter } = await supabase
    .from('waiters')
    .select('*')
    .eq('username', username)
    .single()

  if (!waiter) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#999' }}>waiter not found</p>
      </main>
    )
  }

  const initials = waiter.full_name.split(' ').map(n => n[0]).join('')

  return (
    <main style={{
      minHeight: '100vh',
      background: '#F7F5F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Georgia', serif",
      padding: '24px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '360px',
        textAlign: 'center',
        boxShadow: '0 2px 40px rgba(0,0,0,0.06)'
      }}>

        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: '#E8F5F0',
          color: '#0F6E56',
          fontSize: '22px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          letterSpacing: '1px'
        }}>
          {initials}
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#1a1a1a', margin: '0 0 6px' }}>
          {waiter.full_name}
        </h1>
        <p style={{ fontSize: '13px', color: '#999', margin: '0 0 4px', fontFamily: 'system-ui, sans-serif' }}>
          {waiter.restaurant}
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: '#E8F5F0',
          color: '#0F6E56',
          fontSize: '11px',
          padding: '3px 10px',
          borderRadius: '20px',
          margin: '8px 0 20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          ✓ verified waiter
        </div>

        <p style={{
          fontSize: '13px',
          color: '#666',
          lineHeight: '1.6',
          margin: '0 0 28px',
          fontStyle: 'italic',
          fontFamily: 'Georgia, serif'
        }}>
          "{waiter.bio}"
        </p>

        <div style={{ height: '1px', background: '#f0f0f0', margin: '0 0 24px' }} />

        <TipForm waiterName={waiter.full_name.split(' ')[0]} />

      </div>
    </main>
  )
}