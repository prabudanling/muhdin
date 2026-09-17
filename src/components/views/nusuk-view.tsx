"use client";

import { useEffect, useState } from "react";
import { apiGet, formatDate, timeAgo } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { toast } from "@/hooks/use-toast";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MEMBER_TYPE_LABEL } from "@/lib/constants";
import type { NusukMetrics, NusukPublicData, NusukSyncLog } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ================= KONSTANTA ================= */

const NUSUK_SERVICES: Record<number, { service: string; level: "LIVE" | "PILOT" | string }> = {
  1: { service: "Nusuk Visa Platform", level: "LIVE" },
  2: { service: "Nusuk Ports & Handling", level: "LIVE" },
  3: { service: "Nusuk Guide Registry", level: "LIVE" },
  4: { service: "Mashaer & Haramain Link", level: "LIVE" },
  5: { service: "Nusuk Mutawif Center", level: "LIVE" },
  6: { service: "Nusuk e-Hotel Portal", level: "LIVE" },
  7: { service: "Nusuk Transport Permit", level: "PILOT" },
  8: { service: "Nusuk Rawdah Alternative Route", level: "PILOT" },
  9: { service: "Nusuk Rawdah Permit", level: "LIVE" },
  10: { service: "Nusuk Food License", level: "PILOT" },
  11: { service: "Nusuk e-Thimar Retail", level: "Q3 2026" },
  12: { service: "Nusuk One-Stop Service", level: "Q1 2027" },
  13: { service: "Nusuk Oversight Link", level: "Q2 2027" },
};

/** Ekosistem dengan izin tersinkron live (VISA, HANDLING, MUTAWIF, HOTEL, TRANSPORT, RAUDAH) */
const SYNCED_ECOSYSTEMS = new Set([1, 2, 3, 5, 6, 7, 9]);

const PERMIT_TYPE_LABEL: Record<string, string> = {
  VISA: "Visa Authorization",
  HANDLING: "Handling Clearance",
  MUTAWIF: "Mutawif License",
  HOTEL: "Hotel Contract",
  TRANSPORT: "Transport Permit",
  RAUDAH: "Rawdah Permit",
};

const PERMIT_STATUS: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: "AKTIF", cls: "bg-primary text-white border-transparent shadow-md" },
  PENDING: { label: "PENDING", cls: "bg-gold/15 text-gold-deep border-gold/50" },
  EXPIRED: { label: "KEDALUWARSA", cls: "bg-muted text-muted-foreground border-border" },
  REJECTED: { label: "DITOLAK", cls: "bg-destructive text-white border-transparent shadow-md" },
};

const LOG_TYPE_LABEL: Record<string, string> = {
  FULL_SYNC: "Full Sync",
  WEBHOOK: "Webhook",
  CONNECTION: "Koneksi",
};

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/nusuk/public",
    copy: "/api/nusuk/public",
    desc: "Data Hub publik — status koneksi, metrik, ekosistem, dan aktivitas sinkronisasi.",
    auth: "Publik",
  },
  {
    method: "GET",
    path: "/api/nusuk/verify?no=…",
    copy: "/api/nusuk/verify?no=NSK-VSA-2026-482913",
    desc: "Cek izin — verifikasi keaslian nomor izin Nusuk secara real-time.",
    auth: "Publik",
  },
  {
    method: "POST",
    path: "/api/nusuk/webhook",
    copy: "/api/nusuk/webhook",
    desc: "Webhook event dari Nusuk — diverifikasi via header X-Nusuk-Signature.",
    auth: "Signature",
  },
  {
    method: "POST",
    path: "/api/nusuk/sync",
    copy: "/api/nusuk/sync",
    desc: "Sinkronisasi penuh izin anggota — khusus admin ekosistem.",
    auth: "Admin",
  },
];

const CURL_EXAMPLE = `# Verifikasi izin Handling Clearance
curl -s "https://muhdin.web.id/api/nusuk/verify?no=NSK-HDL-2026-152220" \\
  -H "Accept: application/json"`;

/* ================= TIPE LOKAL ================= */

interface VerifyResponse {
  permit: {
    permitNo: string;
    type: string;
    holderName: string;
    status: string;
    meta: string | null;
    issuedAt: string;
    expiresAt: string;
    lastSync: string;
  };
  member: { name: string; type: string; city: string; licenseNo: string; status: string };
  checkedAt: string;
  environment: string;
}

/* ================= UTIL KECIL ================= */

function fmtNum(n: number) {
  return new Intl.NumberFormat("id-ID").format(Number(n) || 0);
}

function fmtRate(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function fmtDuration(ms: number) {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} dtk`;
}

/* ================= CHIP & LABEL ================= */

function LevelChip({ level }: { level: string }) {
  if (level === "LIVE") {
    return (
      <Badge className="bg-primary text-white border-transparent text-[9px] px-2 py-0.5 shrink-0">
        LIVE
      </Badge>
    );
  }
  if (level === "PILOT") {
    return (
      <Badge variant="outline" className="border-gold/50 bg-gold/10 text-gold-deep text-[9px] px-2 py-0.5 shrink-0">
        PILOT
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-border text-muted-foreground text-[9px] px-2 py-0.5 shrink-0">
      {level}
    </Badge>
  );
}

function LogTypeChip({ type }: { type: string }) {
  const cls =
    type === "FULL_SYNC"
      ? "bg-primary/10 text-primary border-primary/30"
      : type === "WEBHOOK"
        ? "bg-gold/15 text-gold-deep border-gold/40"
        : "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={cn("text-[10px] font-bold", cls)}>
      <Icon
        name={type === "FULL_SYNC" ? "refresh" : type === "WEBHOOK" ? "webhook" : "plug"}
        className="h-3 w-3 mr-1"
      />
      {LOG_TYPE_LABEL[type] || type}
    </Badge>
  );
}

function CopyButton({ text, label }: { text: string; label?: string }) {
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Disalin ✓", description: label || "Teks tersalin ke clipboard." });
    } catch {
      toast({ title: "Gagal menyalin", description: "Clipboard tidak tersedia di peramban ini.", variant: "destructive" });
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Salin ${label || "teks"} ke clipboard`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-100/80 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <Icon name="braces" className="h-3.5 w-3.5" />
      Salin
    </button>
  );
}

/* ================= HERO ================= */

function Hero({ data }: { data: NusukPublicData | null }) {
  const connected = data?.connection.status === "CONNECTED";
  const sandbox = data?.connection.environment === "SANDBOX";

  return (
    <section className="relative bg-forest-deep text-white overflow-hidden" aria-labelledby="nusuk-hero-title">
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-deep to-forest-deep" />
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl animate-float-soft" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <Reveal>
          <Badge className="bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 px-3.5 py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.18em]">
            <Icon name="satellite" className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            NUSUK CONNECT
          </Badge>
          <h1 id="nusuk-hero-title" className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
            Terhubung Langsung dengan <span className="text-gold-gradient">Platform Nusuk</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-emerald-50/80 leading-relaxed">
            {data ? (
              <>
                Jembatan data resmi ekosistem MUHDIN ke Nusuk — platform digital Kementerian Hajj &amp; Umrah
                Kerajaan Saudi Arabia. Sinkronisasi {data.connection.autoSync ? "otomatis berjalan" : "dijalankan manual"}{" "}
                dan telah tercatat{" "}
                <span className="font-semibold text-white">{fmtNum(data.connection.totalSyncs)}×</span> pada
                lingkungan {data.connection.environment}.
              </>
            ) : (
              "Mengambil status koneksi dari registri Nusuk Kementerian Hajj & Umrah Kerajaan Saudi Arabia…"
            )}
          </p>

          {/* 3 chip live */}
          <div className="mt-7 flex flex-wrap items-center gap-2.5" aria-label="Status koneksi Nusuk">
            {!data ? (
              <>
                <Skeleton className="h-8 w-40 rounded-full bg-white/10" />
                <Skeleton className="h-8 w-32 rounded-full bg-white/10" />
                <Skeleton className="h-8 w-52 rounded-full bg-white/10" />
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold">
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping",
                        connected ? "bg-emerald-400" : "bg-red-400"
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex h-2.5 w-2.5 rounded-full",
                        connected ? "bg-emerald-400" : "bg-red-400"
                      )}
                    />
                  </span>
                  {connected ? "Terhubung" : "Terputus"} · {data.connection.status}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                    sandbox
                      ? "border-gold/50 bg-gold/10 text-gold"
                      : "border-emerald-300/40 bg-emerald-400/10 text-emerald-200"
                  )}
                >
                  <Icon name="keyround" className="h-3.5 w-3.5 shrink-0" />
                  {data.connection.environment}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold">
                  <Icon name="timer" className="h-3.5 w-3.5 text-gold shrink-0" />
                  Sinkron terakhir: {timeAgo(data.connection.lastSyncAt)}
                </span>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= METRIK LIVE ================= */

function StatCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="h-full rounded-2xl border bg-card p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] sm:text-xs text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function MetricsSection({
  metrics,
  totalSyncs,
}: {
  metrics: NusukMetrics;
  totalSyncs: number;
}) {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="nusuk-metrics-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Live Metrics"
          title="Denyut Integrasi Nusuk"
          subtitle="Angka real-time dari registri izin ekosistem MUHDIN yang tersinkron dengan platform Nusuk."
        />
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Reveal>
            <StatCard icon="shield-check" label="Izin Aktif" value={fmtNum(metrics.permitsActive)} />
          </Reveal>
          <Reveal delay={0.06}>
            <StatCard icon="grid-3x3" label="Anggota Tersinkron" value={fmtNum(metrics.membersConnected)} />
          </Reveal>
          <Reveal delay={0.12}>
            <StatCard icon="activity" label="Tingkat Sukses Sinkron" value={`${fmtRate(metrics.successRate)}%`} />
          </Reveal>
          <Reveal delay={0.18}>
            <StatCard icon="refresh" label="Total Sinkronisasi" value={fmtNum(totalSyncs)} />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-4 rounded-2xl border bg-muted/40 p-4 flex flex-col lg:flex-row lg:items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1.5">
              <Icon name="database-zap" className="h-3.5 w-3.5 text-primary" />
              Izin per tipe
            </p>
            <div className="flex flex-wrap gap-2">
              {metrics.byType.map((t) => (
                <span
                  key={t.type}
                  className="inline-flex items-center gap-1.5 rounded-full bg-card border px-3 py-1 text-[11px] font-medium"
                  title={`${PERMIT_TYPE_LABEL[t.type] || t.type}: ${t.total} total, ${t.active} aktif`}
                >
                  <span className="font-mono font-bold text-primary">{t.type}</span>
                  <span className="text-muted-foreground">
                    {t.total} total · {t.active} aktif
                  </span>
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground lg:ml-auto shrink-0 flex items-center gap-1.5">
              <Icon name="timer" className="h-3.5 w-3.5 text-gold-deep" />
              Rata-rata {fmtDuration(metrics.avgDurationMs)} · {metrics.syncsLast7d} sinkron / 7 hari
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= CEK IZIN (PERMIT CHECKER) ================= */

function InfoRow({ icon, label, children }: { icon: string; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-3.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
        <Icon name={icon} className="h-3.5 w-3.5 text-primary" />
        {label}
      </p>
      <div className="mt-1.5 text-sm font-semibold text-foreground leading-snug break-words">{children}</div>
    </div>
  );
}

function PermitChecker() {
  const [no, setNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState("");

  const verify = async () => {
    const q = no.trim().toUpperCase();
    if (!q) {
      setResult(null);
      setError("Masukkan nomor izin Nusuk terlebih dahulu.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiGet<VerifyResponse>(`/api/nusuk/verify?no=${encodeURIComponent(q)}`);
      setResult(res);
    } catch (e) {
      setResult(null);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const status = result ? PERMIT_STATUS[result.permit.status] || PERMIT_STATUS.EXPIRED : null;

  return (
    <div className="max-w-3xl mx-auto">
      <Reveal>
        <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
          <div className="border-b bg-gradient-to-r from-primary/5 via-transparent to-gold/5 p-5 sm:p-6">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-gold-deep to-gold grid place-items-center text-forest-deep shadow-md">
                <Icon name="scan" className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-tight">Cek Izin Nusuk</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Verifikasi keaslian izin yang diterbitkan melalui integrasi Nusuk–MUHDIN.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon
                  name="qr-code"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none"
                />
                <Input
                  value={no}
                  onChange={(e) => setNo(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && verify()}
                  placeholder="Contoh: NSK-VSA-2026-482913"
                  aria-label="Nomor izin Nusuk"
                  className="pl-9 h-11 font-mono uppercase tracking-wider"
                />
              </div>
              <Button
                onClick={verify}
                disabled={loading}
                aria-label="Verifikasi nomor izin sekarang"
                className="h-11 px-6 bg-gradient-to-r from-gold-deep to-gold text-forest-deep font-bold hover:brightness-110 shrink-0"
              >
                {loading ? (
                  <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Icon name="scan" className="h-4 w-4 mr-2" />
                )}
                Verifikasi Sekarang
              </Button>
            </div>
            <p className="mt-2.5 text-xs text-muted-foreground flex items-start gap-1.5">
              <Icon name="info" className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-deep" />
              Nomor izin tercantum pada bukti pemesanan dari penyelenggara terverifikasi MUHDIN.
            </p>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2.5"
              >
                <Icon name="alert-triangle" className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold">Verifikasi gagal</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {result && status && (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/[0.04] p-5 sm:p-6" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge className={cn("px-3.5 py-1.5 text-xs font-extrabold tracking-wide", status.cls)}>
                    <Icon name="badge-check" className="h-4 w-4 mr-1.5" />
                    {status.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Icon name="shield-check" className="h-3.5 w-3.5 text-primary" />
                    {result.environment} · dicek {timeAgo(result.checkedAt)}
                  </span>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Nomor Izin
                    </p>
                    <p className="mt-1 font-mono text-xl sm:text-2xl font-bold tracking-tight break-all">
                      {result.permit.permitNo}
                    </p>
                    <p className="mt-2 text-sm font-bold text-primary">
                      {PERMIT_TYPE_LABEL[result.permit.type] || result.permit.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      a.n. <span className="font-semibold text-foreground">{result.permit.holderName}</span>
                    </p>
                  </div>
                  <div className="shrink-0 w-full sm:w-48" aria-hidden="true">
                    <div
                      className="h-14 rounded-md bg-forest-deep/90"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, transparent 0 2px, #d4af37 2px 3px, transparent 3px 6px, #d4af37 6px 9px, transparent 9px 10px, #d4af37 10px 11px, transparent 11px 15px)",
                      }}
                    />
                    <p className="mt-1.5 text-center font-mono text-[10px] tracking-[0.2em] text-forest-deep/70">
                      {result.permit.permitNo}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  <InfoRow icon="building-2" label="Penyelenggara">
                    {result.member.name}
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-normal text-muted-foreground">
                      <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0">
                        {MEMBER_TYPE_LABEL[result.member.type] || result.member.type}
                      </Badge>
                      {result.member.city} · Izin{" "}
                      <span className="font-mono font-semibold">{result.member.licenseNo}</span>
                    </span>
                  </InfoRow>
                  <InfoRow icon="calendar" label="Masa Berlaku">
                    {formatDate(result.permit.issuedAt)} → {formatDate(result.permit.expiresAt)}
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      Sinkron terakhir {timeAgo(result.permit.lastSync)}
                    </span>
                  </InfoRow>
                  {result.permit.meta && (
                    <div className="sm:col-span-2">
                      <InfoRow icon="clipboard-list" label="Keterangan Izin">
                        <span className="font-normal text-foreground/80">{result.permit.meta}</span>
                      </InfoRow>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "fingerprint", title: "Data Registri Resmi", desc: "Sumber tunggal registri izin Nusuk-MUHDIN." },
          { icon: "cable", title: "Real-Time Sync", desc: "Status mencerminkan sinkronisasi terakhir." },
          { icon: "shield-ellipsis", title: "Anti-Izin Palsu", desc: "Lindungi jamaah dari dokumen tidak sah." },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border bg-muted/30 p-4 text-center">
            <Icon name={c.icon} className="h-5 w-5 mx-auto text-primary" />
            <p className="mt-2 text-sm font-bold">{c.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}

function PermitCheckerSection() {
  return (
    <section className="py-14 sm:py-20 bg-mint/30 dark:bg-muted/30" aria-labelledby="nusuk-checker-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Permit Checker"
          title="Cek Keaslian Izin Nusuk"
          subtitle="Alat publik gratis untuk jamaah dan mitra: masukkan nomor izin dan dapatkan status resminya dalam sekejap."
        />
        <div className="mt-10">
          <PermitChecker />
        </div>
      </div>
    </section>
  );
}

/* ================= MATRIKS 13 EKOSISTEM ================= */

function MatrixSection({ ecosystems }: { ecosystems: NusukPublicData["ecosystems"] }) {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="nusuk-matrix-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Integrasi Matrix"
          title="Matriks 13 Ekosistem × Nusuk"
          subtitle="Peta cakupan layanan MUHDIN terhadap platform Nusuk — dari visa hingga pengawasan mutu, beserta tahapan ketersediaannya."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ecosystems.map((eco, i) => {
            const svc = NUSUK_SERVICES[eco.number];
            return (
              <Reveal key={eco.number} delay={Math.min(i * 0.035, 0.4)}>
                <div className="h-full rounded-2xl border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-forest grid place-items-center text-gold-soft shadow-sm">
                      <Icon name={eco.icon} className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-bold text-muted-foreground truncate">
                          #{String(eco.number).padStart(2, "0")} · {eco.cluster}
                        </p>
                        <LevelChip level={svc?.level ?? "SOON"} />
                      </div>
                      <h3 className="mt-1 font-bold text-sm leading-snug">{eco.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {svc?.service || "Menyusun integrasi teknis"}
                      </p>
                      {SYNCED_ECOSYSTEMS.has(eco.number) && (
                        <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                          <Icon name="check-circle-2" className="h-3 w-3" />
                          Izin tersinkron live
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= API BRIDGE ================= */

function EndpointRow({
  method,
  path,
  copy,
  desc,
  auth,
}: {
  method: string;
  path: string;
  copy: string;
  desc: string;
  auth: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 px-4 sm:px-5 py-3.5 transition-colors hover:bg-white/[0.03]">
      <span
        className={cn(
          "inline-flex w-fit shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider",
          method === "GET"
            ? "border-primary/50 bg-primary/20 text-emerald-200"
            : "border-gold/50 bg-gold/15 text-gold"
        )}
      >
        {method}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs sm:text-[13px] font-semibold text-white break-all">{path}</p>
        <p className="mt-0.5 text-[11px] sm:text-xs text-emerald-100/60 leading-relaxed">{desc}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 sm:justify-end">
        <span className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-100/50">
          {auth}
        </span>
        <CopyButton text={copy} label={path} />
      </div>
    </div>
  );
}

function ApiBridgeSection() {
  return (
    <section className="py-14 sm:py-20 bg-mint/30 dark:bg-muted/30" aria-labelledby="nusuk-api-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="API Bridge"
          title="Nusuk API Bridge"
          subtitle="Jembatan data terbuka antara MUHDIN dan Nusuk. Endpoint publik dapat dipakai mitra untuk integrasi mandiri."
        />
        <Reveal className="mt-10">
          <div className="rounded-2xl bg-forest-deep text-emerald-50 shadow-xl border border-white/10 overflow-hidden">
            {/* window bar */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 sm:px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-gold/80" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-primary/90" aria-hidden="true" />
              <span className="ml-3 font-mono text-[11px] text-emerald-100/60 flex items-center gap-1.5 truncate">
                <Icon name="terminal" className="h-3.5 w-3.5 shrink-0" />
                muhdin.web.id · nusuk-api-v1
              </span>
              <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                ONLINE
              </span>
            </div>

            <div className="divide-y divide-white/5" role="list" aria-label="Daftar endpoint Nusuk API">
              {API_ENDPOINTS.map((ep) => (
                <EndpointRow key={ep.path} {...ep} />
              ))}
            </div>

            <div className="border-t border-white/10 px-4 sm:px-5 py-4">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-emerald-100/60 flex items-center gap-1.5">
                  <Icon name="braces" className="h-3.5 w-3.5 shrink-0" />
                  Contoh permintaan cURL — cek izin
                </p>
                <CopyButton text={CURL_EXAMPLE} label="Contoh cURL" />
              </div>
              <pre
                aria-label="Contoh perintah cURL"
                className="overflow-x-auto scrollbar-thin rounded-xl bg-black/40 border border-white/10 p-4 font-mono text-[11px] sm:text-xs leading-relaxed text-emerald-100/90"
              >
                <code>{CURL_EXAMPLE}</code>
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= WEBHOOK FEED ================= */

function SyncFeedSection({ logs }: { logs: NusukSyncLog[] }) {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="nusuk-feed-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Webhook Feed"
          title="Aktivitas Sinkronisasi Terbaru"
          subtitle="Jejak audit setiap event yang mengalir antara Nusuk dan registri MUHDIN — transparan dan dapat diperiksa publik."
        />
        <div className="mt-10 max-w-3xl mx-auto">
          {logs.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <Icon name="radar" className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">Belum ada aktivitas sinkronisasi tercatat.</p>
            </div>
          ) : (
            <ol className="relative ml-2 border-l-2 border-primary/20 space-y-4">
              {logs.slice(0, 6).map((log, i) => {
                const ok = log.status === "SUCCESS";
                return (
                  <li key={log.id} className="relative pl-6 sm:pl-8">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-[9px] top-4 h-4 w-4 rounded-full border-[3px] border-background",
                        ok ? "bg-primary" : "bg-destructive"
                      )}
                    />
                    <Reveal delay={Math.min(i * 0.05, 0.3)}>
                      <div className="rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex flex-wrap items-center gap-2">
                          <LogTypeChip type={log.type} />
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold",
                              ok
                                ? "border-primary/30 bg-primary/5 text-primary"
                                : "border-destructive/30 bg-destructive/5 text-destructive"
                            )}
                          >
                            <Icon name={ok ? "check-circle-2" : "alert-triangle"} className="h-3 w-3 mr-1" />
                            {ok ? "SUCCESS" : "FAILED"}
                          </Badge>
                          <span className="ml-auto text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <Icon name="timer" className="h-3 w-3 shrink-0" />
                            {fmtDuration(log.durationMs)} · {timeAgo(log.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{log.message}</p>
                        {log.recordsAffected > 0 && (
                          <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1.5">
                            <Icon name="database-zap" className="h-3.5 w-3.5 text-gold-deep" />
                            {log.recordsAffected} record terdampak
                          </p>
                        )}
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

/* ================= ANGGOTA PALING PATUH ================= */

function TopMembersSection({ members }: { members: NusukPublicData["topMembers"] }) {
  return (
    <section className="py-14 sm:py-20 bg-mint/30 dark:bg-muted/30" aria-labelledby="nusuk-members-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Compliance Leaderboard"
          title="Anggota Paling Patuh"
          subtitle="Peringkat anggota dengan izin Nusuk aktif terbanyak dan tingkat kepatuhan sinkronisasi tertinggi."
        />
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex items-center gap-3 sm:gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/40">
                <span
                  className={cn(
                    "h-9 w-9 shrink-0 rounded-full grid place-items-center font-extrabold text-sm shadow-sm",
                    i === 0
                      ? "bg-gradient-to-br from-gold-deep to-gold text-forest-deep"
                      : "bg-forest-deep text-gold-soft"
                  )}
                  aria-label={`Peringkat ${i + 1}`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm truncate">{m.name}</p>
                    <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 shrink-0">
                      {MEMBER_TYPE_LABEL[m.type] || m.type}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="map-pin" className="h-3 w-3 shrink-0" />
                    {m.city}
                  </p>
                  <div
                    className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden"
                    role="progressbar"
                    aria-valuenow={m.compliance}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Kepatuhan ${m.name}`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-forest"
                      style={{ width: `${Math.min(100, Math.max(2, m.compliance))}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-extrabold leading-none">{m.activePermits}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">izin aktif</p>
                  <p className="mt-1 text-[10px] font-bold text-primary">{m.compliance}% patuh</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */

function CtaSection() {
  return (
    <section className="py-14 sm:py-20" aria-labelledby="nusuk-cta-title">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-primary to-forest-deep p-10 sm:p-14 text-center shadow-2xl">
            <div className="absolute inset-0 bg-islamic-pattern-gold opacity-50" />
            <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl animate-float-soft" />
            <div className="relative">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gold/20 border border-gold/40 grid place-items-center text-gold">
                <Icon name="radio-tower" className="h-7 w-7" />
              </div>
              <h2 id="nusuk-cta-title" className="mt-5 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Penyelenggara Anda Belum <span className="text-gold-gradient">Terhubung Nusuk?</span>
              </h2>
              <p className="mt-4 text-emerald-50/85 max-w-2xl mx-auto leading-relaxed">
                Bergabunglah dengan ekosistem MUHDIN dan nikmati sinkronisasi izin otomatis ke platform Nusuk —
                visa, handling, hotel, hingga Rawdah — tanpa kerumitan administrasi terpisah.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("gabung")}
                  aria-label="Gabung MUHDIN sekarang"
                  className="bg-gradient-to-r from-gold-deep to-gold text-forest-deep font-bold h-12 px-8 hover:brightness-110"
                >
                  <Icon name="handshake" className="h-5 w-5 mr-2" />
                  Gabung MUHDIN
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("kontak")}
                  aria-label="Hubungi tim integrasi"
                  className="border-white/30 text-white hover:bg-white/10 h-12 px-8"
                >
                  <Icon name="send" className="h-5 w-5 mr-2" />
                  Hubungi Tim Integrasi
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= LOADING & ERROR ================= */

function LoadingSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 space-y-8"
      aria-busy="true"
      aria-label="Memuat data Nusuk Hub"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-4 w-64 mx-auto" />
      <Skeleton className="h-72 rounded-3xl" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="py-14 sm:py-20" aria-label="Gagal memuat data">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-center">
          <Icon name="alert-triangle" className="h-10 w-10 mx-auto text-destructive" />
          <h2 className="mt-3 text-lg font-extrabold text-destructive">Gagal Memuat Nusuk Hub</h2>
          <p className="mt-1.5 text-sm text-destructive/90">{message}</p>
          <Button
            variant="outline"
            onClick={onRetry}
            aria-label="Coba muat ulang data Nusuk"
            className="mt-5 border-destructive/40 text-destructive hover:bg-destructive hover:text-white"
          >
            <Icon name="refresh" className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ================= MAIN ================= */

export function NusukView() {
  const [data, setData] = useState<NusukPublicData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    apiGet<NusukPublicData>("/api/nusuk/public")
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setError("");
    setLoading(true);
    setAttempt((a) => a + 1);
  };

  return (
    <div className="flex flex-col">
      <Hero data={data} />

      {error ? (
        <>
          <ErrorState message={error} onRetry={retry} />
          {/* Checker tetap dapat dipakai karena endpoint-nya independen */}
          <PermitCheckerSection />
          <CtaSection />
        </>
      ) : !data ? (
        <LoadingSkeleton />
      ) : (
        <>
          <MetricsSection metrics={data.metrics} totalSyncs={data.connection.totalSyncs} />
          <PermitCheckerSection />
          <MatrixSection ecosystems={data.ecosystems} />
          <ApiBridgeSection />
          <SyncFeedSection logs={data.recentLogs} />
          <TopMembersSection members={data.topMembers} />
          <CtaSection />
        </>
      )}
    </div>
  );
}

export default NusukView;
