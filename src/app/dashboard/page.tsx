"use client";

import Link from "next/link";
import MainLayout from "@/components/MainLayout";

export default function DashboardPage() {
  return (
    <MainLayout breadcrumbs={[{ label: "Dashboard" }]} userName="Sunil P">
      <h1 style={{ fontSize:"1.75rem", fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.03em" }}>Dashboard</h1>
      <p style={{ color:"var(--text-secondary)", marginTop:"0.4rem", fontSize:"0.88rem" }}>
        Welcome back! Navigate to{" "}
        <Link href="/events" style={{ color:"var(--accent)", fontWeight:600 }}>My Events</Link>{" "}
        to manage your academic activities.
      </p>
    </MainLayout>
  );
}
