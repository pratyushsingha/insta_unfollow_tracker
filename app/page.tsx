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
          padding: clamp(8px, 2vw, 12px) 0;
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
          padding: 0 clamp(16px, 4vw, 32px);
          font-size: clamp(10px, 2.5vw, 12px);
          font-weight: 500;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-family: "DM Sans", sans-serif;
        }
        @media (max-width: 640px) {
          .ticker-track {
            animation: ticker 30s linear infinite;
          }
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
        padding: "clamp(20px, 5vw, 28px)",
        transition: "transform 0.3s, border-color 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      <div
        style={{
          fontSize: "clamp(24px, 6vw, 28px)",
          marginBottom: "clamp(10px, 3vw, 14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "clamp(44px, 10vw, 52px)",
          height: "clamp(44px, 10vw, 52px)",
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
          fontSize: "clamp(14px, 3.5vw, 16px)",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "clamp(13px, 3vw, 14px)",
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
      <style jsx global>{`
        @media (max-width: 768px) {
          html {
            font-size: 14px;
          }
        }
      `}</style>
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
            padding: "0 16px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(16px, 4vw, 18px)",
              letterSpacing: "-0.5px",
              color: "var(--text)",
            }}
          >
            Insta<span style={{ color: "var(--accent)" }}>Track</span>
          </span>
          <Link
            href="/unsubscribe"
            style={{
              fontSize: "clamp(11px, 3vw, 13px)",
              color: "var(--text-muted)",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.1)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
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
          paddingTop: "clamp(60px, 12vw, 100px)",
          paddingBottom: "clamp(40px, 8vw, 80px)",
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
            padding: "0 clamp(16px, 5vw, 24px)",
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
              gap: "6px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: "100px",
              padding: "clamp(5px, 1.5vw, 6px) clamp(12px, 3vw, 16px)",
              marginBottom: "clamp(16px, 4vw, 28px)",
              fontSize: "clamp(10px, 2.5vw, 12px)",
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
                flexShrink: 0,
              }}
            />
            Free · No login required
          </div>

          {/* Headline */}
          <h1
            className="hidden-initially animate-fade-up delay-2"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(32px, 8vw, 56px)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "clamp(-1px, -0.15vw, -2px)",
              color: "var(--text)",
              marginBottom: "clamp(16px, 4vw, 24px)",
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
              fontSize: "clamp(14px, 3.5vw, 18px)",
              color: "var(--text-muted)",
              lineHeight: 1.7,
              marginBottom: "clamp(24px, 6vw, 48px)",
              maxWidth: "520px",
              margin: "0 auto clamp(24px, 6vw, 48px)",
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
              padding: "clamp(24px, 6vw, 36px)",
              maxWidth: "clamp(280px, 90vw, 480px)",
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
                  padding: "clamp(12px, 3vw, 16px) 0",
                  animation: "fadeUp 0.5s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(36px, 10vw, 48px)",
                    marginBottom: "16px",
                    animation: "float-up 2s ease infinite",
                  }}
                >
                  🎉
                </div>
                <h3
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontSize: "clamp(18px, 5vw, 20px)",
                    fontWeight: 700,
                    marginBottom: "12px",
                    color: "var(--text)",
                    background:
                      "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  You&apos;re all set!
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "clamp(13px, 3vw, 14px)",
                    lineHeight: 1.6,
                    marginBottom: "16px",
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
                    padding: "clamp(8px, 2vw, 8px) clamp(16px, 4vw, 20px)",
                    fontSize: "clamp(12px, 3vw, 13px)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.color = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "var(--border-2)";
                    e.currentTarget.style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
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
                      fontSize: "clamp(10px, 2.5vw, 12px)",
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
                        fontSize: "clamp(13px, 3.5vw, 15px)",
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
                        padding: "clamp(11px, 3vw, 13px) 14px clamp(11px, 3vw, 13px) 32px",
                        fontSize: "clamp(14px, 3.5vw, 15px)",
                        color: "var(--text)",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--accent)";
                        e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--border-2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: "clamp(10px, 2.5vw, 11px)",
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
                      fontSize: "clamp(10px, 2.5vw, 12px)",
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
                      padding: "clamp(11px, 3vw, 13px) 14px",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      color: "var(--text)",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {state === "error" && (
                  <div
                    style={{
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.3)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      marginBottom: "16px",
                      fontSize: "clamp(12px, 3vw, 13px)",
                      color: "var(--red)",
                      textAlign: "left",
                      animation: "slideInLeft 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>⚠️</span>
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
                    padding: "clamp(12px, 3vw, 14px)",
                    fontSize: "clamp(14px, 3.5vw, 15px)",
                    fontWeight: 700,
                    color: "#fff",
                    cursor: state === "loading" ? "not-allowed" : "pointer",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    fontFamily: "Syne, sans-serif",
                    letterSpacing: "0.3px",
                    minHeight: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      state === "loading"
                        ? "none"
                        : "0 4px 20px rgba(99, 102, 241, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    if (state !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 8px 32px rgba(99, 102, 241, 0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 20px rgba(99, 102, 241, 0.2)";
                  }}
                  onMouseDown={(e) => {
                    if (state !== "loading")
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(1px)";
                  }}
                  onMouseUp={(e) => {
                    if (state !== "loading")
                      (e.currentTarget as HTMLButtonElement).style.transform =
                        "translateY(-2px)";
                  }}
                >
                  {state === "loading" ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          animation: "float-up 1.5s ease infinite",
                        }}
                      >
                        ⏳
                      </span>
                      Setting up...
                    </span>
                  ) : (
                    "Start Tracking →"
                  )}
                </button>

                <p
                  style={{
                    fontSize: "clamp(10px, 2.5vw, 11px)",
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
      <div style={{ marginTop: "clamp(40px, 8vw, 60px)" }}>
        <Ticker />
      </div>

      {/* How it works */}
      <section
        style={{
          padding: "clamp(60px, 12vw, 100px) clamp(16px, 5vw, 24px)",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 8vw, 64px)" }}>
          <p
            style={{
              fontSize: "clamp(10px, 2.5vw, 12px)",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "12px",
            }}
          >
            How it works
          </p>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              background:
                "linear-gradient(135deg, var(--text) 0%, var(--text-muted) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dead simple. Fully automated.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(150px, 40vw, 240px), 1fr))",
            gap: "clamp(16px, 4vw, 20px)",
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
          padding: "clamp(50px, 10vw, 80px) clamp(16px, 5vw, 24px)",
          maxWidth: "1100px",
          margin: "0 auto",
          background: "rgba(99,102,241,0.03)",
          borderRadius: "24px",
          border: "1px solid rgba(99,102,241,0.1)",
          marginBottom: "clamp(50px, 10vw, 80px)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "clamp(32px, 8vw, 48px)" }}>
          <p
            style={{
              fontSize: "clamp(10px, 2.5vw, 12px)",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "12px",
            }}
          >
            Your Data is Safe
          </p>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              background:
                "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Security by Design
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 45vw, 280px), 1fr))",
            gap: "clamp(16px, 4vw, 24px)",
          }}
        >
          {/* Card 1 */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "clamp(20px, 5vw, 32px)",
            transition: "transform 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}>
            <div style={{ fontSize: "clamp(28px, 8vw, 32px)", marginBottom: "16px" }}>🔑</div>
            <h3 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(16px, 4vw, 20px)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "12px"
            }}>No Passwords Required</h3>
            <p style={{
              fontSize: "clamp(13px, 3vw, 15px)",
              color: "var(--text-muted)",
              lineHeight: 1.6
            }}>We never ask for your Instagram password or require you to log in via Meta. We only need your username to check your public follower list, making it 100% impossible for us to post, like, or modify your account.</p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "clamp(20px, 5vw, 32px)",
            transition: "transform 0.3s, border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}>
            <div style={{ fontSize: "clamp(28px, 8vw, 32px)", marginBottom: "16px" }}>🛡️</div>
            <h3 style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(16px, 4vw, 20px)",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "12px"
            }}>AES-256 Encryption at Rest</h3>
            <p style={{
              fontSize: "clamp(13px, 3vw, 15px)",
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
          padding: "clamp(24px, 6vw, 32px) clamp(16px, 5vw, 24px)",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(clamp(120px, 30vw, 180px), 1fr))",
            gap: "clamp(16px, 4vw, 24px)",
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
                  fontSize: "clamp(24px, 6vw, 32px)",
                  fontWeight: 800,
                  color: "var(--accent)",
                  letterSpacing: "-1px",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "clamp(10px, 2.5vw, 12px)",
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
      <section style={{ padding: "clamp(60px, 12vw, 100px) clamp(16px, 5vw, 24px)", textAlign: "center" }}>
        <div style={{ maxWidth: "540px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 6vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-1px",
              background:
                "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "16px",
            }}
          >
            Ready to find out the truth?
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "24px",
              fontSize: "clamp(14px, 3.5vw, 16px)",
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
              padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 36px)",
              fontSize: "clamp(14px, 3.5vw, 16px)",
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "Syne, sans-serif",
              letterSpacing: "0.3px",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              minHeight: "44px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 8px 32px rgba(99, 102, 241, 0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 4px 20px rgba(99, 102, 241, 0.2)";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(1px)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
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
          padding: "clamp(24px, 5vw, 32px) clamp(16px, 5vw, 24px)",
          textAlign: "center",
          color: "var(--text-dim)",
          fontSize: "clamp(11px, 2.5vw, 13px)",
        }}
      >
        <p>
          InstaTrack &bull;{" "}
          <Link
            href="/unsubscribe"
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              transition: "color 0.2s",
              borderBottom: "1px solid transparent",
              paddingBottom: "2px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.borderBottomColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-muted)";
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
          >
            Unsubscribe
          </Link>{" "}
          &bull; Not affiliated with Instagram or Meta
        </p>
      </footer>
    </div>
  );
}
