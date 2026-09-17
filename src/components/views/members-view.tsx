"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet, apiSend } from "@/lib/client-api";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MEMBER_TYPES, MEMBER_TYPE_LABEL } from "@/lib/constants";
import type { Member } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_FILTERS = [
  { value: "all", label: "Semua Jenis" },
  ...MEMBER_TYPES.map((t) => ({ value: t, label: MEMBER_TYPE_LABEL[t] })),
];

export function MembersView() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-forest-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-current opacity-60" />
              Direktori Resmi
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Anggota &amp; Verifikasi Ekosistem</h1>
            <p className="mt-3 max-w-2xl text-emerald-50/80">
              Direktori publik penyelenggara terverifikasi MUHDIN. Legalitas dan rekam jejak
              diverifikasi, sanksi ditegakkan konsisten, dan mutu diaudit berkala.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Tabs defaultValue="direktori" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="direktori" className="gap-2">
                <Icon name="grid-3x3" className="h-4 w-4" /> Direktori Anggota
              </TabsTrigger>
              <TabsTrigger value="verifikasi" className="gap-2">
                <Icon name="shield-check" className="h-4 w-4" /> Cek Verifikasi
              </TabsTrigger>
            </TabsList>
            <TabsContent value="direktori">
              <DirectoryTab />
            </TabsContent>
            <TabsContent value="verifikasi">
              <VerifyTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

/* ============ DIREKTORI ============ */
function DirectoryTab() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [type, setType] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    apiGet<Member[]>("/api/members").then(setMembers).catch(() => setMembers([]));
  }, []);

  const filtered = useMemo(() => {
    if (!members) return [];
    return members.filter((m) => {
      const okType = type === "all" || m.type === type;
      const okQ =
        !q ||
        m.name.toLowerCase().includes(q.toLowerCase()) ||
        m.city.toLowerCase().includes(q.toLowerCase()) ||
        m.province.toLowerCase().includes(q.toLowerCase());
      return okType && okQ;
    });
  }, [members, type, q]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-0.5">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                type === f.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-muted text-foreground/70 hover:bg-primary/10 hover:text-primary"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative lg:ml-auto w-full lg:w-72">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari nama, kota, provinsi…" className="pl-9" />
        </div>
      </div>

      {!members ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Icon name="search" className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">Tidak ada anggota yang cocok dengan filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => (
            <Reveal key={m.id} delay={Math.min(i * 0.04, 0.4)}>
              <div className="h-full rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-forest grid place-items-center text-gold-soft font-extrabold">
                      {m.name.replace(/^PT\s|^Koperasi\s+/i, "").charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm leading-snug">{m.name}</h3>
                      <p className="text-[11px] text-muted-foreground">
                        {MEMBER_TYPE_LABEL[m.type] || m.type} · Sejak {m.memberSince}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={m.status} />
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-muted-foreground flex-1">
                  <p className="flex items-center gap-1.5">
                    <Icon name="map-pin" className="h-3.5 w-3.5 text-primary" />
                    {m.city}, {m.province}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Icon name="file-text" className="h-3.5 w-3.5 text-primary" />
                    Izin: <span className="font-mono font-semibold text-foreground/80">{m.licenseNo}</span>
                  </p>
                  {m.description && <p className="line-clamp-2 pt-1">{m.description}</p>}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Icon
                        key={s}
                        name="star"
                        className={cn(
                          "h-3.5 w-3.5",
                          s < Math.round(m.rating) ? "fill-gold text-gold" : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                    <span className="ml-1 text-xs font-bold">{m.rating.toFixed(1)}</span>
                  </div>
                  {m.phone && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icon name="phone" className="h-3 w-3" /> {m.phone}
                    </span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    TERVERIFIKASI: { label: "Terverifikasi", cls: "bg-primary/10 text-primary border-primary/30" },
    PENDING: { label: "Dalam Proses", cls: "bg-gold/15 text-gold-deep border-gold/40" },
    SUSPENDED: { label: "Ditangguhkan", cls: "bg-destructive/10 text-destructive border-destructive/30" },
  };
  const s = map[status] || map.PENDING;
  return (
    <Badge variant="outline" className={cn("text-[10px] font-bold shrink-0", s.cls)}>
      {status === "TERVERIFIKASI" && <Icon name="badge-check" className="h-3 w-3 mr-1" />}
      {s.label}
    </Badge>
  );
}

/* ============ VERIFIKASI ============ */
function VerifyTab() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; warning: string | null; results: Member[] } | null>(null);
  const [error, setError] = useState("");

  const verify = async () => {
    setError("");
    setResult(null);
    if (query.trim().length < 3) {
      setError("Masukkan minimal 3 karakter nama penyelenggara atau nomor izin.");
      return;
    }
    setLoading(true);
    try {
      const res = await apiGet<{ found: boolean; warning: string | null; results: Member[] }>(
        `/api/members/verify?q=${encodeURIComponent(query.trim())}`
      );
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeading
        eyebrow="Verifikasi Satu Klik"
        title="Periksa Legalitas Sebelum Bertransaksi"
        subtitle="Masukkan nama penyelenggara atau nomor izin. Hasil verifikasi berbasis direktori resmi MUHDIN — melindungi jamaah dari pelaku ilegal."
      />

      <Reveal className="mt-8">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Icon name="shield-check" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                placeholder="Contoh: PT Insan Barokah atau PPIU-2026-0011"
                className="pl-9 h-11"
              />
            </div>
            <Button onClick={verify} disabled={loading} className="h-11 px-6 bg-gradient-to-r from-primary to-forest text-white">
              {loading ? <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="search" className="h-4 w-4 mr-2" />}
              Verifikasi
            </Button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-destructive flex items-center gap-1.5">
              <Icon name="alert-triangle" className="h-4 w-4" /> {error}
            </p>
          )}

          {result && (
            <div className="mt-5">
              {result.warning && (
                <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-sm text-destructive font-medium">
                  {result.warning}
                </div>
              )}
              {result.found ? (
                <div className="space-y-3">
                  {result.results.map((m) => (
                    <div key={m.id} className="rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold">{m.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {MEMBER_TYPE_LABEL[m.type]} · {m.city}, {m.province} · Izin {m.licenseNo}
                        </p>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl bg-gold/10 border border-gold/30 p-4">
                  <p className="font-bold text-gold-deep flex items-center gap-2">
                    <Icon name="alert-triangle" className="h-4 w-4" /> Tidak Ditemukan dalam Direktori
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/75">
                    Penyelenggara dengan nama/izin tersebut tidak terdaftar di ekosistem MUHDIN.
                    Hati-hati terhadap pelaku ilegal — pastikan selalu memverifikasi legalitas
                    melalui kanal resmi sebelum menyetorkan dana.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "badge-check", title: "Legalitas Terverifikasi", desc: "Izin resmi dan rekam jejak diverifikasi tim MUHDIN." },
          { icon: "wallet", title: "Dana Terlindungi", desc: "Escrow dan takaful sebagai standar ekosistem." },
          { icon: "shield-alert", title: "Nol Toleransi Penipuan", desc: "Sanksi berjenjang hingga pelaporan ke regulator." },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border bg-muted/30 p-4 text-center">
            <Icon name={c.icon} className="h-6 w-6 mx-auto text-primary" />
            <p className="mt-2 text-sm font-bold">{c.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
