"use client";

import { useEffect, useState } from "react";
import { apiGet, formatDateTime } from "@/lib/client-api";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBadge } from "@/components/admin/crud-manager";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AdminStats, MembershipApplication, ContactMessage, NusukPublicData } from "@/lib/types";

const PIE_COLORS = ["#0b5c3f", "#d4a017", "#3e8e68", "#8a6d1f", "#5db08c", "#b5cc4e"];

export function AdminDashboard({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<AdminStats>("/api/stats").then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error)
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <Icon name="alert-triangle" className="h-8 w-8 mx-auto text-destructive" />
        <p className="mt-2 text-sm text-destructive font-medium">{error}</p>
      </div>
    );

  if (!stats)
    return (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );

  const cards = [
    { label: "Berita & Artikel", value: stats.articles, icon: "newspaper", section: "articles", tone: "text-primary bg-primary/10" },
    { label: "Anggota Terverifikasi", value: stats.members, icon: "grid-3x3", section: "members", tone: "text-gold-deep bg-gold/15" },
    { label: "Tutorial Aktif", value: stats.tutorials, icon: "graduation-cap", section: "tutorials", tone: "text-primary bg-primary/10" },
    { label: "Total Dilihat", value: stats.totalViews, icon: "eye", section: "articles", tone: "text-gold-deep bg-gold/15" },
    { label: "Pesan Belum Dibaca", value: stats.unreadMessages, icon: "inbox", section: "messages", tone: "text-destructive bg-destructive/10", alert: stats.unreadMessages > 0 },
    { label: "Pendaftaran Menunggu", value: stats.pendingApplications, icon: "user-plus", section: "applications", tone: "text-destructive bg-destructive/10", alert: stats.pendingApplications > 0 },
    { label: "FAQ", value: stats.faqs, icon: "help-circle", section: "faqs", tone: "text-primary bg-primary/10" },
    { label: "Testimoni", value: stats.testimonials, icon: "quote", section: "testimonials", tone: "text-gold-deep bg-gold/15" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-r from-forest to-primary p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-30" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-extrabold">Assalamu&apos;alaikum, Admin! 👋</h2>
            <p className="mt-1 text-sm text-emerald-50/85">
              Ringkasan aktivitas ekosistem MUHDIN hari ini — Bersama Melayani Tamu Allah.
            </p>
          </div>
          <div className="sm:ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => onNavigate("applications")}>
              <Icon name="user-plus" className="h-4 w-4 mr-1.5" />
              Verifikasi Pendaftaran
            </Button>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={() => onNavigate(c.section)}
            className="text-left rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className={`h-10 w-10 rounded-xl grid place-items-center ${c.tone}`}>
                <Icon name={c.icon} className="h-5 w-5" />
              </div>
              {c.alert && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive" />
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-extrabold">{c.value.toLocaleString("id-ID")}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Integrasi Nusuk status */}
      <NusukStatusCard onNavigate={onNavigate} />

      {/* Charts */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Artikel per Kategori</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }}
                />
                <Bar dataKey="count" name="Jumlah" fill="#0b5c3f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <h3 className="font-bold text-sm mb-4">Komposisi Anggota per Jenis Mitra</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.memberByType}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {stats.memberByType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            {stats.memberByType.map((m, i) => (
              <span key={m.type} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {m.type} ({m.count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recent lists */}
      <div className="grid gap-5 lg:grid-cols-2">
        <RecentList
          title="Pesan Masuk Terbaru"
          icon="inbox"
          action={() => onNavigate("messages")}
          items={stats.recentMessages.map((m: ContactMessage) => ({
            id: m.id,
            title: `${m.name} — ${m.subject}`,
            subtitle: formatDateTime(m.createdAt),
            badge: m.status,
          }))}
        />
        <RecentList
          title="Pendaftaran Terbaru"
          icon="user-plus"
          action={() => onNavigate("applications")}
          items={stats.recentApplications.map((a: MembershipApplication) => ({
            id: a.id,
            title: `${a.orgName} (${a.type})`,
            subtitle: `${a.city} · ${formatDateTime(a.createdAt)}`,
            badge: a.status,
          }))}
        />
      </div>
    </div>
  );
}

function RecentList({
  title,
  icon,
  items,
  action,
}: {
  title: string;
  icon: string;
  items: { id: string; title: string; subtitle: string; badge: string }[];
  action: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Icon name={icon} className="h-4 w-4 text-primary" />
          {title}
        </h3>
        <Button variant="ghost" size="sm" className="text-primary h-7" onClick={action}>
          Kelola <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="divide-y max-h-64 overflow-y-auto scrollbar-thin">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">Belum ada data.</p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground">{it.subtitle}</p>
              </div>
              <AdminBadge status={it.badge} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ================= INTEGRASI NUSUK — STATUS CARD ================= */
function NusukStatusCard({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [data, setData] = useState<NusukPublicData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    apiGet<NusukPublicData>("/api/nusuk/public")
      .then(setData)
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  const connected = data?.connection.status === "CONNECTED";

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-11 w-11 shrink-0 rounded-xl bg-primary/10 grid place-items-center text-primary">
          <Icon name="satellite" className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3" aria-hidden>
            {connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />}
            <span className={`relative inline-flex rounded-full h-3 w-3 border-2 border-card ${connected ? "bg-primary" : "bg-muted-foreground/50"}`} />
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm flex items-center gap-2">
            Integrasi Nusuk
            {data && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {connected ? "Terhubung" : "Terputus"}
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {data
              ? `${data.connection.environment || "—"} · ${data.metrics.permitsActive} izin aktif · ${data.metrics.successRate}% sukses sinkron`
              : "Memuat status integrasi…"}
          </p>
        </div>
      </div>
      <div className="sm:ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="h-9 text-primary border-primary/40 hover:bg-primary/10"
          onClick={() => onNavigate("nusuk")}
        >
          Kelola Integrasi
          <Icon name="chevron-right" className="h-3.5 w-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
