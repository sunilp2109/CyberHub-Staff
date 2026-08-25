"use client";

import Link from "next/link";
import Sidebar from "./Sidebar";
import styles from "./MainLayout.module.css";

interface Crumb { label: string; href?: string }

interface Props {
  children: React.ReactNode;
  breadcrumbs?: Crumb[];
  userName?: string;
}

const IcoBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export default function MainLayout({ children, breadcrumbs = [], userName = "SP" }: Props) {
  // Derive initials from userName
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "SP";

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                {i > 0 && <span className={styles.crumbSep}>›</span>}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href}>{crumb.label}</Link>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? styles.crumbCurrent : ""}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>

          <div className={styles.headerRight}>
            <button className={styles.notifBtn} aria-label="Notifications">
              <IcoBell />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.avatar} title="My Profile">{initials}</div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
