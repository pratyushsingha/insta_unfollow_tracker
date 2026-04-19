'use client'

import { useState } from 'react'
import Link from 'next/link'

type State = 'idle' | 'loading' | 'success' | 'error'

export default function UnsubscribePage() {
  const [email, setEmail] = useState('')
  const [deleteData, setDeleteData] = useState(false)
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setState('loading')
    setMessage('')

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, deleteData }),
      })
      const data = await res.json()

      if (!res.ok) {
        setState('error')
        setMessage(data.error || 'Something went wrong.')
      } else {
        setState('success')
        setMessage(data.message)
        setEmail('')
      }
    } catch {
      setState('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Nav */}
      <nav
        style={{
          borderBottom: '1px solid var(--border)',
          padding: '0 clamp(16px, 5vw, 24px)',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(16px, 4vw, 18px)',
            letterSpacing: '-0.5px',
            color: 'var(--text)',
            textDecoration: 'none',
          }}
        >
          Insta<span style={{ color: 'var(--accent)' }}>Track</span>
        </Link>
      </nav>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(24px, 6vw, 40px) clamp(16px, 5vw, 24px)',
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%' }}>
          {/* Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 40px)' }}>
            <div style={{ fontSize: 'clamp(36px, 10vw, 48px)', marginBottom: '20px' }}>👋</div>
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(28px, 6vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-1px',
                color: 'var(--text)',
                marginBottom: '12px',
              }}
            >
              Unsubscribe
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: 'clamp(14px, 3.5vw, 15px)',
                lineHeight: 1.6,
              }}
            >
              Sorry to see you go. Enter your email address and we&apos;ll stop
              sending you daily reports immediately.
            </p>
          </div>

          {/* Card */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              padding: 'clamp(24px, 6vw, 32px)',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background:
                  'linear-gradient(90deg, transparent, rgba(248,113,113,0.5), transparent)',
                borderRadius: '20px 20px 0 0',
              }}
            />

            {state === 'success' ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 'clamp(32px, 10vw, 40px)', marginBottom: '16px' }}>✅</div>
                <h3
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: 'clamp(16px, 4vw, 18px)',
                    fontWeight: 700,
                    color: 'var(--text)',
                    marginBottom: '10px',
                  }}
                >
                  Unsubscribed
                </h3>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: 'clamp(13px, 3vw, 14px)',
                    lineHeight: 1.6,
                  }}
                >
                  {message}
                </p>
                <Link
                  href="/"
                  style={{
                    display: 'inline-block',
                    marginTop: '24px',
                    fontSize: 'clamp(12px, 3vw, 13px)',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                  }}
                >
                  ← Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'clamp(10px, 2.5vw, 12px)',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                      marginBottom: '8px',
                    }}
                  >
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: '100%',
                      background: 'var(--bg)',
                      border: '1px solid var(--border-2)',
                      borderRadius: '10px',
                      padding: 'clamp(11px, 3vw, 13px) 14px',
                      fontSize: 'clamp(14px, 3.5vw, 15px)',
                      color: 'var(--text)',
                      outline: 'none',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                      minHeight: '44px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--red)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(248, 113, 113, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border-2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="deleteData"
                    checked={deleteData}
                    onChange={(e) => setDeleteData(e.target.checked)}
                    style={{
                      marginTop: '6px',
                      accentColor: 'var(--red)',
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <label htmlFor="deleteData" style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.5 }}>
                    Delete all my historical follower data from the database
                  </label>
                </div>

                {state === 'error' && (
                  <div
                    style={{
                      background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.3)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      fontSize: 'clamp(12px, 3vw, 13px)',
                      color: 'var(--red)',
                      animation: 'slideInLeft 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === 'loading'}
                  style={{
                    width: '100%',
                    background:
                      state === 'loading'
                        ? 'var(--border-2)'
                        : 'rgba(248,113,113,0.15)',
                    border: '1px solid rgba(248,113,113,0.3)',
                    borderRadius: '10px',
                    padding: 'clamp(12px, 3vw, 14px)',
                    fontSize: 'clamp(14px, 3.5vw, 15px)',
                    fontWeight: 700,
                    color: state === 'loading' ? 'var(--text-muted)' : 'var(--red)',
                    cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'Syne, sans-serif',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow:
                      state === 'loading'
                        ? 'none'
                        : '0 4px 12px rgba(248,113,113,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    if (state !== 'loading') {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        'translateY(-2px)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        '0 8px 24px rgba(248,113,113,0.25)';
                      e.currentTarget.style.background = 'rgba(248,113,113,0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      '0 4px 12px rgba(248,113,113,0.15)';
                    e.currentTarget.style.background = 'rgba(248,113,113,0.15)';
                  }}
                  onMouseDown={(e) => {
                    if (state !== 'loading')
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        'translateY(1px)';
                  }}
                  onMouseUp={(e) => {
                    if (state !== 'loading')
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        'translateY(-2px)';
                  }}
                >
                  {state === 'loading' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', animation: 'float-up 1.5s ease infinite' }}>⏳</span>
                      Processing...
                    </span>
                  ) : (
                    'Unsubscribe Me'
                  )}
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link
                    href="/"
                    style={{
                      fontSize: 'clamp(12px, 3vw, 13px)',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99,102,241,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    ← Back to home
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
