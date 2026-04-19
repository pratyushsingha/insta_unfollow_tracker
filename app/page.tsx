"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = "idle" | "loading" | "success" | "error";

const TICKER_ITEMS = [
  "@designerjohn unfollowed you",
  "@travel_vibes unfollowed you",
  "@old_friend_2019 unfollowed you",
  "@fashion.weekly unfollowed you",
  "@photography.co unfollowed you",
  "@mutual_23 unfollowed you",
  "@collab_studio unfollowed you",
  "@influencer_xyz unfollowed you",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="ticker-wrapper">
      <div className="ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="ticker-item">
            <span className="ticker-dot" />
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        .ticker-wrapper {
          overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 12px 0;
          background: var(--surface);
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 40s linear infinite;
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          padding: 0 32px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-family: "DM Sans", sans-serif;
        }
        .ticker-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent);
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: string;
}) {
  return (
    <div
      className={`feature-card hidden-initially animate-fade-up ${delay}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "28px",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "52px",
          height: "52px",
          background: "var(--accent-glow)",
          borderRadius: "12px",
          border: "1px solid rgba(129,140,248,0.2)",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "var(--text-muted)",
          lineHeight: "1.6",
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !username) return;

    setState("loading");
    setMessage("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          instaUsername: username.replace(/^@/, ""),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setMessage(data.error || "Something went wrong.");
      } else {
        setState("success");
        setMessage(data.message);
        setEmail("");
        setUsername("");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          background: "rgba(8,8,8,0.85)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              letterSpacing: "-0.5px",
              color: "var(--text)",
            }}
          >
            Insta<span style={{ color: "var(--accent)" }}>Track</span>
          </span>
          <Link
            href="/unsubscribe"
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Unsubscribe
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "100px",
          paddingBottom: "80px",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "5%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(129,140,248,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Badge */}
          <div
            className={`hidden-initially animate-fade-up delay-1`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "100px",
              padding: "6px 16px",
              marginBottom: "28px",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent)",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--green)",
                animation: "pulse-glow 2s ease infinite",
              }}
            />
            Free · No login required
          </div>

          {/* Headline */}
          <h1
            className="hidden-initially animate-fade-up delay-2"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(40px, 7vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              color: "var(--text)",
              marginBottom: "24px",
            }}
          >
            Know exactly who{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              unfollowed you
            </span>{" "}
            on Instagram.
          </h1>

          <p
            className="hidden-initially animate-fade-up delay-3"
            style={{
              fontSize: "18px",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              marginBottom: "48px",
              maxWidth: "520px",
              margin: "0 auto 48px",
            }}
          >
            Enter your public Instagram username and email. We&apos;ll check
            your followers every morning and send you a report — completely
            free.
          </p>

          {/* Signup Form Card */}
          <div
            className="hidden-initially animate-fade-up delay-4"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              padding: "36px",
              maxWidth: "480px",
              margin: "0 auto",
              position: "relative",
            }}
          >
            {/* Corner accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background:
                  "linear-gradient(90deg, transparent, var(--accent-2), transparent)",
                borderRadius: "20px 20px 0 0",
              }}
            />

            {state === "success" ? (
              <div
                style={{
                  padding: "16px 0",
                  animation: "fadeUp 0.4s ease",
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    color: "var(--text)",
                  }}
                >
                  You&apos;re all set!
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {message}
                </p>
                <button
                  onClick={() => setState("idle")}
                  style={{
                    marginTop: "24px",
                    background: "transparent",
                    border: "1px solid var(--border-2)",
                    borderRadius: "8px",
                    color: "var(--text-muted)",
                    padding: "8px 20px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Track another account
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px", textAlign: "left" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Instagram Username
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--accent)",
                        fontWeight: 600,
                        fontSize: "15px",
                        pointerEvents: "none",
                      }}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="yourhandle"
                      required
                      style={{
                        width: "100%",
                        background: "var(--bg)",
                        border: "1px solid var(--border-2)",
                        borderRadius: "10px",
                        padding: "13px 14px 13px 32px",
                        fontSize: "15px",
                        color: "var(--text)",
                        outline: "none",
                        transition: "border-color 0.2s",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = "var(--accent)")
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "var(--border-2)")
                      }
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-dim)",
                      marginTop: "6px",
                    }}
                  >
                    Must be a public account
                  </p>
                </div>

                <div style={{ marginBottom: "20px", textAlign: "left" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                      marginBottom: "8px",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border-2)",
                      borderRadius: "10px",
                      padding: "13px 14px",
                      fontSize: "15px",
                      color: "var(--text)",
                      outline: "none",
                      transition: "border-color 0.2s",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border-2)")
                    }
                  />
                </div>

                {state === "error" && (
                  <div
                    style={{
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.25)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      marginBottom: "16px",
                      fontSize: "13px",
                      color: "var(--red)",
                      textAlign: "left",
                    }}
                  >
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  style={{
                    width: "100%",
                    background:
                      state === "loading"
                        ? "var(--border-2)"
                        : "linear-gradient(135deg, #6366f1, #818cf8)",
                    border: "none",
                    borderRadius: "10px",
                    padding: "14px",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#fff",
                    cursor: state === "loading" ? "not-allowed" : "pointer",
                    transition: "opacity 0.2s, transform 0.1s",
                    fontFamily: "Syne, sans-serif",
                    letterSpacing: "0.3px",
                  }}
                  onMouseEnter={(e) => {
                    if (state !== "loading")
                      (e.currentTarget as HTMLButtonElement).style.opacity =
                        "0.9";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  }}
                >
                  {state === "loading" ? "Setting up..." : "Start Tracking →"}
                </button>

                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--text-dim)",
                    marginTop: "14px",
                    textAlign: "center",
                  }}
                >
                  We only read your follower list. We never post, like, or
                  comment.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ marginTop: "60px" }}>
        <Ticker />
      </div>

      {/* How it works */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "var(--text)",
            }}
          >
            Dead simple. Fully automated.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: "📝",
              title: "Sign up once",
              desc: "Enter your public Instagram username and email. No account creation, no password.",
              delay: "delay-1",
            },
            {
              icon: "🤖",
              title: "We fetch daily",
              desc: "Every morning at 8 AM, our bot checks your follower list and compares it to yesterday.",
              delay: "delay-2",
            },
            {
              icon: "📧",
              title: "Email report",
              desc: "Get a clean email listing anyone who unfollowed you. Click their username to visit their profile.",
              delay: "delay-3",
            },
            {
              icon: "🔒",
              title: "Read-only access",
              desc: "We only read your public follower count. We never post, like, comment, or touch your account.",
              delay: "delay-4",
            },
          ].map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* Security & Privacy */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: "1100px",
          margin: "0 auto",
          background: "rgba(99,102,241,0.03)",
          borderRadius: "24px",
          border: "1px solid rgba(99,102,241,0.1)",
          marginBottom: "80px"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "16px",
            }}
          >
            Your Data is Safe
          </p>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "var(--text)",
            }}
          >
            Security by Design
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Card 1 */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔑</div>
            <h3 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "12px"
            }}>No Passwords Required</h3>
            <p style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              lineHeight: 1.6
            }}>We never ask for your Instagram password or require you to log in via Meta. We only need your username to check your public follower list, making it 100% impossible for us to post, like, or modify your account.</p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px"
          }}>
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>🛡️</div>
            <h3 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "12px"
            }}>AES-256 Encryption at Rest</h3>
            <p style={{
              fontSize: "15px",
              color: "var(--text-muted)",
              lineHeight: 1.6
            }}>Military-grade database security. Your data is encrypted using AES-256-GCM before they are saved to our database. In the unlikely event of a server breach, your data remains completely unreadable.</p>
          </div>
        </div>
      </section>

      {/* Stats bar */} 
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            textAlign: "center",
          }}
        >
          {[
            { value: "8AM", label: "Daily check time IST" },
            { value: "100%", label: "Free forever" },
            { value: "0", label: "Passwords stored" },
          ].map((stat) => (
            <div key={stat.label}>
              <div
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--accent)",
                  letterSpacing: "-1px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "4px",
                  letterSpacing: "0.3px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "540px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              color: "var(--text)",
              marginBottom: "16px",
            }}
          >
            Ready to find out the truth?
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "36px",
              fontSize: "16px",
            }}
          >
            Scroll back up and enter your Instagram username. Takes 10 seconds.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              border: "none",
              borderRadius: "12px",
              padding: "16px 36px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "Syne, sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            Start Tracking — It&apos;s Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          textAlign: "center",
          color: "var(--text-dim)",
          fontSize: "13px",
        }}
      >
        <p>
          InstaTrack &bull;{" "}
          <Link
            href="/unsubscribe"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            Unsubscribe
          </Link>{" "}
          &bull; Not affiliated with Instagram or Meta
        </p>
      </footer>
    </div>
  );
}
