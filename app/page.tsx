'use client'

import { useState } from 'react'

const content = {
  en: {
    nav: { login: 'log in', signup: 'create profile' },
    hero: {
      tagline: 'Tips that go straight to you',
      sub: 'Guests tip you directly. No restaurant in the middle. No redistribution. Just your money, instantly.',
      cta: 'create your free profile',
      guest: 'tipping someone? scan their QR code',
    },
    how: {
      title: 'how it works',
      steps: [
        { icon: '①', title: 'sign up in 2 minutes', body: 'create your profile with your name, restaurant, and a username. your personal page is live instantly.' },
        { icon: '②', title: 'connect your bank', body: 'we use Stripe to send money directly to you. secure, fast, and you keep 100% of every tip.' },
        { icon: '③', title: 'share your QR code', body: 'print it on a badge, text the link, or show your phone. guests tip you in under 20 seconds.' },
      ]
    },
    why: {
      title: 'why tippn',
      points: [
        { stat: '100%', label: 'of every tip goes to you' },
        { stat: '0s', label: 'waiting — tips land instantly' },
        { stat: 'no app', label: 'guests need to download' },
      ]
    },
    footer: { tagline: 'Tips that go straight to you', signup: 'create profile', login: 'log in' }
  },
  pt: {
    nav: { login: 'entrar', signup: 'criar perfil' },
    hero: {
      tagline: 'Gorjetas diretas para ti',
      sub: 'Os clientes pagam-te diretamente. Sem restaurante no meio. Sem redistribuição. O teu dinheiro, na hora.',
      cta: 'cria o teu perfil grátis',
      guest: 'queres dar gorjeta? lê o QR code',
    },
    how: {
      title: 'como funciona',
      steps: [
        { icon: '①', title: 'regista-te em 2 minutos', body: 'cria o teu perfil com o teu nome, restaurante e username. a tua página fica ativa imediatamente.' },
        { icon: '②', title: 'liga a tua conta bancária', body: 'usamos o Stripe para te enviar o dinheiro diretamente. seguro, rápido, e ficas com 100% de cada gorjeta.' },
        { icon: '③', title: 'partilha o teu QR code', body: 'imprime num crachá, envia o link por mensagem ou mostra o telemóvel. os clientes pagam em menos de 20 segundos.' },
      ]
    },
    why: {
      title: 'porquê o tippn',
      points: [
        { stat: '100%', label: 'de cada gorjeta é teu' },
        { stat: '0s', label: 'de espera — gorjetas instantâneas' },
        { stat: 'sem app', label: 'para os clientes instalarem' },
      ]
    },
    footer: { tagline: 'Gorjetas diretas para ti', signup: 'criar perfil', login: 'entrar' }
  }
}

const Logo = ({ size = 32 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 + 'px' }}>
    <svg width={size} height={size} viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="32" fill="#1D9E75"/>
      <line x1="32" y1="42" x2="32" y2="20" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      <polyline points="20,30 32,18 44,30" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{ fontFamily: 'Georgia, serif', fontSize: size * 0.9 + 'px', fontWeight: 400, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>tippn</span>
  </div>
)

export default function Home() {
  const [lang, setLang] = useState('en')
  const t = content[lang]

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '0.5px solid #f0f0f0', maxWidth: '960px', margin: '0 auto' }}>
        <Logo size={28} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setLang(lang === 'en' ? 'pt' : 'en')} style={{ background: 'none', border: '0.5px solid #e0e0e0', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', cursor: 'pointer', color: '#666' }}>
            {lang === 'en' ? '🇵🇹 PT' : '🇬🇧 EN'}
          </button>
          <a href="/login" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>{t.nav.login}</a>
          <a href="/signup" style={{ background: '#1D9E75', color: '#fff', borderRadius: '20px', padding: '8px 16px', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>{t.nav.signup}</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#E8F5F0', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', color: '#0F6E56', marginBottom: '32px', fontWeight: 500 }}>
          <span>✓</span> waiters keep 100% of every tip
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontFamily: 'Georgia, serif', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-1px' }}>
          {t.hero.tagline}
        </h1>
        <p style={{ fontSize: '18px', color: '#666', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 40px' }}>
          {t.hero.sub}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/signup" style={{ background: '#1D9E75', color: '#fff', borderRadius: '12px', padding: '16px 32px', fontSize: '15px', textDecoration: 'none', fontWeight: 500 }}>
            {t.hero.cta} →
          </a>
          <a href="#how" style={{ background: '#F7F5F0', color: '#333', borderRadius: '12px', padding: '16px 32px', fontSize: '15px', textDecoration: 'none' }}>
            {t.hero.guest}
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#F7F5F0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {t.why.points.map((p, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '24px', textAlign: 'center', border: '0.5px solid #f0f0f0' }}>
              <div style={{ fontSize: '32px', fontWeight: 500, color: '#1D9E75', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>{p.stat}</div>
              <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.4 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 400, color: '#1a1a1a', textAlign: 'center', marginBottom: '48px' }}>
          {t.how.title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {t.how.steps.map((step, i) => (
            <div key={i} style={{ padding: '32px', border: '0.5px solid #f0f0f0', borderRadius: '20px', position: 'relative' }}>
              <div style={{ fontSize: '24px', marginBottom: '16px', color: '#1D9E75' }}>{step.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1a1a1a', margin: '0 0 10px' }}>{step.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ background: '#1D9E75', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 400, color: '#fff', margin: '0 0 12px' }}>
          {t.hero.tagline}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', margin: '0 0 32px' }}>
          {lang === 'en' ? 'Free to join. Takes 2 minutes.' : 'Gratuito. Demora 2 minutos.'}
        </p>
        <a href="/signup" style={{ background: '#fff', color: '#1D9E75', borderRadius: '12px', padding: '16px 32px', fontSize: '15px', textDecoration: 'none', fontWeight: 500 }}>
          {t.hero.cta} →
        </a>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid #f0f0f0', padding: '32px 24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Logo size={22} />
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="/signup" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>{t.footer.signup}</a>
            <a href="/login" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>{t.footer.login}</a>
            <a href="/marco" style={{ fontSize: '13px', color: '#666', textDecoration: 'none' }}>{lang === 'en' ? 'see an example' : 'ver exemplo'}</a>
          </div>
          <p style={{ fontSize: '12px', color: '#bbb', margin: 0 }}>© 2026 tippn</p>
        </div>
      </footer>

    </main>
  )
}