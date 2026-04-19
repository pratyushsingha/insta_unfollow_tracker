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
          padding: '0 24px',
          height: '60px',
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
            fontSize: '18px',
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
          padding: '40px 24px',
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%' }}>
          {/* Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👋</div>
            <h1
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '32px',
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
                fontSize: '15px',
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
              padding: '32px',
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
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
                <h3
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '18px',
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
                    fontSize: '14px',
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
                    fontSize: '13px',
                    color: 'var(--accent)',
                    textDecoration: 'none',
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
                      fontSize: '12px',
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
                      padding: '13px 14px',
                      fontSize: '15px',
                      color: 'var(--text)',
                      outline: 'none',
                      fontFamily: 'DM Sans, sans-serif',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = 'var(--red)')
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = 'var(--border-2)')
                    }
                  />
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="deleteData"
                    checked={deleteData}
                    onChange={(e) => setDeleteData(e.target.checked)}
                    style={{
                      marginTop: '3px',
                      accentColor: 'var(--red)',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer'
                    }}
                  />
                  <label htmlFor="deleteData" style={{ fontSize: '14px', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1.5 }}>
                    Delete all my historical follower data from the database
                  </label>
                </div>

                {state === 'error' && (
                  <div
                    style={{
                      background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.2)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '16px',
                      fontSize: '13px',
                      color: 'var(--red)',
                    }}
                  >
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
                    padding: '14px',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: state === 'loading' ? 'var(--text-muted)' : 'var(--red)',
                    cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'Syne, sans-serif',
                    transition: 'background 0.2s',
                  }}
                >
                  {state === 'loading' ? 'Processing...' : 'Unsubscribe Me'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link
                    href="/"
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                    }}
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
