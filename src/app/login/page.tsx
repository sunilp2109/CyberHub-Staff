"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

/* ── Inline SVG icons (no external deps needed) ── */
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ── Animated Cybersecurity Network SVG ── */
const CyberNetworkSVG = () => (
  <svg viewBox="0 0 300 280" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
      </radialGradient>
      <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.7"/>
        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0"/>
      </radialGradient>
      <filter id="blur1">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    {/* Background gradient blobs */}
    <circle cx="80" cy="80" r="60" fill="url(#glow1)" style={{animation:"pulseGlow 3s ease-in-out infinite"}}/>
    <circle cx="200" cy="160" r="45" fill="url(#glow2)" style={{animation:"pulseGlow 4s ease-in-out infinite 1s"}}/>

    {/* Connection lines */}
    <line x1="75" y1="55"  x2="160" y2="100" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.35" style={{animation:"lineFade 3.5s ease-in-out infinite"}}/>
    <line x1="160" y1="100" x2="240" y2="70"  stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.3"  style={{animation:"lineFade 4s ease-in-out infinite 0.5s"}}/>
    <line x1="75" y1="55"  x2="110" y2="140" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.25" style={{animation:"lineFade 2.8s ease-in-out infinite 1s"}}/>
    <line x1="110" y1="140" x2="160" y2="100" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.3"  style={{animation:"lineFade 3.2s ease-in-out infinite 0.2s"}}/>
    <line x1="110" y1="140" x2="200" y2="175" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.3"  style={{animation:"lineFade 3.8s ease-in-out infinite 1.5s"}}/>
    <line x1="160" y1="100" x2="200" y2="175" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.25" style={{animation:"lineFade 4.2s ease-in-out infinite 0.8s"}}/>
    <line x1="200" y1="175" x2="240" y2="70"  stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.2"  style={{animation:"lineFade 3s ease-in-out infinite 2s"}}/>
    <line x1="200" y1="175" x2="255" y2="200" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.25" style={{animation:"lineFade 2.5s ease-in-out infinite 0.7s"}}/>
    <line x1="45"  y1="180" x2="110" y2="140" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.2"  style={{animation:"lineFade 4.5s ease-in-out infinite 1.2s"}}/>
    <line x1="45"  y1="180" x2="75"  y2="55"  stroke="#2563eb" strokeWidth="0.5" strokeOpacity="0.15" style={{animation:"lineFade 5s ease-in-out infinite 0.3s"}}/>
    <line x1="160" y1="100" x2="130" y2="220" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.2"  style={{animation:"lineFade 3.6s ease-in-out infinite 1.8s"}}/>
    <line x1="130" y1="220" x2="200" y2="175" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.25" style={{animation:"lineFade 3.1s ease-in-out infinite 0.9s"}}/>
    <line x1="240" y1="70"  x2="270" y2="130" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.2"  style={{animation:"lineFade 2.9s ease-in-out infinite 1.4s"}}/>
    <line x1="270" y1="130" x2="255" y2="200" stroke="#2563eb" strokeWidth="0.8" strokeOpacity="0.25" style={{animation:"lineFade 3.4s ease-in-out infinite 0.6s"}}/>

    {/* Glow halos behind main nodes */}
    <circle cx="75"  cy="55"  r="14" fill="#60a5fa" fillOpacity="0.15" style={{animation:"pulseGlow 2.8s ease-in-out infinite"}}/>
    <circle cx="160" cy="100" r="16" fill="#3b82f6" fillOpacity="0.18" style={{animation:"pulseGlow 3.2s ease-in-out infinite 0.5s"}}/>
    <circle cx="200" cy="175" r="13" fill="#60a5fa" fillOpacity="0.15" style={{animation:"pulseGlow 3.8s ease-in-out infinite 1s"}}/>

    {/* Main nodes (brighter, bigger) */}
    <circle cx="75"  cy="55"  r="5.5" fill="#1e40af" style={{animation:"pulse 2.8s ease-in-out infinite"}}/>
    <circle cx="160" cy="100" r="7"   fill="#1d4ed8" style={{animation:"pulse 3.2s ease-in-out infinite 0.5s"}}/>
    <circle cx="200" cy="175" r="5"   fill="#1e40af" style={{animation:"pulse 3.8s ease-in-out infinite 1s"}}/>

    {/* Secondary nodes */}
    <circle cx="240" cy="70"  r="4"   fill="#2563eb" style={{animation:"pulse2 2.5s ease-in-out infinite 0.3s"}}/>
    <circle cx="110" cy="140" r="4"   fill="#2563eb" style={{animation:"pulse2 3.5s ease-in-out infinite 0.8s"}}/>
    <circle cx="45"  cy="180" r="3.5" fill="#3b82f6" style={{animation:"pulse2 4s ease-in-out infinite 1.2s"}}/>
    <circle cx="130" cy="220" r="3.5" fill="#3b82f6" style={{animation:"pulse2 3s ease-in-out infinite 1.6s"}}/>
    <circle cx="255" cy="200" r="3"   fill="#60a5fa" style={{animation:"pulse2 2.7s ease-in-out infinite 0.5s"}}/>
    <circle cx="270" cy="130" r="3"   fill="#60a5fa" style={{animation:"pulse2 3.3s ease-in-out infinite 2s"}}/>
    <circle cx="30"  cy="100" r="2.5" fill="#93c5fd" style={{animation:"pulse2 4.2s ease-in-out infinite 0.7s"}}/>
    <circle cx="190" cy="40"  r="2.5" fill="#93c5fd" style={{animation:"pulse2 3.7s ease-in-out infinite 1.4s"}}/>

    {/* Extra micro nodes */}
    <circle cx="140" cy="50"  r="2"   fill="#bfdbfe" style={{animation:"pulse2 5s ease-in-out infinite 0.4s"}}/>
    <circle cx="90"  cy="230" r="2"   fill="#bfdbfe" style={{animation:"pulse2 4.5s ease-in-out infinite 1.1s"}}/>
    <circle cx="280" cy="210" r="2"   fill="#bfdbfe" style={{animation:"pulse2 3.9s ease-in-out infinite 0.2s"}}/>

    {/* Dot clusters (scatter) */}
    <circle cx="55"  cy="130" r="1.5" fill="#93c5fd" fillOpacity="0.6"/>
    <circle cx="220" cy="120" r="1.5" fill="#93c5fd" fillOpacity="0.6"/>
    <circle cx="175" cy="240" r="1.5" fill="#93c5fd" fillOpacity="0.6"/>
    <circle cx="310" cy="90"  r="1.5" fill="#93c5fd" fillOpacity="0.5"/>

    <style>{`
      @keyframes pulse {
        0%, 100% { opacity:0.65; }
        50%       { opacity:1;    }
      }
      @keyframes pulse2 {
        0%, 100% { opacity:0.4; }
        50%       { opacity:0.9; }
      }
      @keyframes pulseGlow {
        0%, 100% { opacity:0.2; }
        50%       { opacity:0.6; }
      }
      @keyframes lineFade {
        0%, 100% { opacity:0.15; }
        50%       { opacity:0.5;  }
      }
    `}</style>
  </svg>
);

/* ── Mock credentials ── */
const MOCK_USERS: Record<string, { password: string; role: string; name: string }> = {
  "admin@cyberhub.edu":    { password: "admin123",   role: "admin",   name: "Admin" },
  "hod@cyberhub.edu":      { password: "hod123",     role: "hod",     name: "Dr. R. Sharma" },
  "faculty@cyberhub.edu":  { password: "faculty123", role: "faculty", name: "Prof. A. Kumar" },
  "student@cyberhub.edu":  { password: "student123", role: "student", name: "Sunil P." },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [remember, setRemember]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your Faculty ID / Email and password.");
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    const user = MOCK_USERS[email.trim().toLowerCase()];
    if (!user || user.password !== password) {
      setError("Invalid credentials. Please check your ID/email and password.");
      setLoading(false);
      return;
    }

    // Store session
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("ch_user", JSON.stringify({ email, role: user.role, name: user.name }));

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className={styles.loginWrapper}>
      {/* ─── LEFT PANEL ─── */}
      <div className={styles.leftPanel}>
        <div className={styles.logo}>
          <div className={styles.logoText}>CyberHub</div>
          <div className={styles.logoSubtitle}>
            Cybersecurity Faculty Event &amp; Activity<br />Management Portal
          </div>
        </div>

        <div className={styles.visualCard}>
          <div className={styles.networkCard}>
            <div className={styles.networkSvgWrapper}>
              <CyberNetworkSVG />
            </div>
            <p className={styles.cardLabel}>CYBERSECURITY &amp; ACADEMIC PARTNERSHIPS</p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h1 className={styles.welcomeHeading}>Welcome back</h1>
          <p className={styles.welcomeSub}>Faculty login</p>

          {error && (
            <div className={styles.errorMsg} role="alert">
              <IconAlert /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Faculty ID / Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.fieldLabel}>Faculty ID / Email</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconUser /></span>
                <input
                  id="email"
                  type="text"
                  className={styles.formInput}
                  placeholder="Enter your ID or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.fieldLabel}>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}><IconLock /></span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className={styles.formInput}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  style={{ paddingRight: "2.8rem" }}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className={styles.checkRow}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>

            {/* Sign In Button */}
            <button
              id="sign-in-btn"
              type="submit"
              className={styles.signInBtn}
              disabled={loading}
            >
              {loading ? (
                <><div className={styles.spinner} /> Signing in…</>
              ) : (
                <>Sign In <span className={styles.btnArrow}>→</span></>
              )}
            </button>
          </form>

          <p className={styles.helpText}>
            Having trouble signing in?{" "}
            <a href="mailto:admin@cyberhub.edu">Contact Department Admin</a>
          </p>
        </div>

        <footer className={styles.footer}>
          CyberHub • Cybersecurity Department<br />Designed by SUNIL
        </footer>
      </div>
    </div>
  );
}
