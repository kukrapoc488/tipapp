export default function OnboardingComplete() {
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
          textAlign: 'center',
          boxShadow: '0 2px 40px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#E8F5F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '22px'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1a1a', marginBottom: '8px' }}>
            you're all set!
          </h1>
          <p style={{ fontSize: '13px', color: '#999', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
            your account is connected. guests can now tip you directly.
          </p>
        </div>
      </main>
    )
  }