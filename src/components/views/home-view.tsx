"use client";

import { useEffect, useState } from "react";
import { apiGet, formatDate, timeAgo } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  PARTNERS, CORE_VALUES, TECH_PILLARS, BENEFITS, CLUSTERS, STATS_HIGHLIGHT, BRAND,
} from "@/lib/constants";
import type { Ecosystem, JourneyStep, Roadmap, Testimonial, Article, NusukPublicData } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ================= HERO ================= */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        { }
        <img
          src="/images/hero-kaaba.jpg"
          alt="Kabah Masjidil Haram saat senja keemasan"
          className="h-full w-full object-cover bg-gradient-to-br from-forest-deep to-forest"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/90 via-forest-deep/75 to-forest-deep/95" />
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 lg:py-36">
        <div className="max-w-3xl">
          <Reveal>
            <Badge className="mb-5 bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide max-w-full">
              <Icon name="sparkles" className="h-3.5 w-3.5 mr-1.5 shrink-0" />
              <span className="truncate">{BRAND.edition}</span>
            </Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white">
              Transformasi Digitalisasi{" "}
              <span className="text-gold-gradient">Umroh &amp; Haji</span> Indonesia 2030
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-lg text-emerald-50/85 leading-relaxed max-w-2xl">
              {BRAND.motto}. 13 ekosistem layanan terintegrasi yang mengawal perjalanan
              Tamu Allah dari Indonesia hingga Tanah Suci — dengan kepastian kuota,
              transparansi mutu, dan pengawalan 24/7.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate("ekosistem")}
                className="bg-gradient-to-r from-gold-deep to-gold text-forest-deep font-bold shadow-xl hover:brightness-110 h-12 px-7 text-base"
              >
                Jelajahi 13 Ekosistem
                <Icon name="arrow-right" className="h-4 w-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("anggota")}
                className="bg-transparent border-emerald-100/40 text-white hover:bg-white/10 hover:text-white h-12 px-7 text-base"
              >
                <Icon name="shield-check" className="h-4 w-4 mr-2" />
                Verifikasi Penyelenggara
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Floating stats */}
        <Reveal delay={0.45} className="mt-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {STATS_HIGHLIGHT.map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl border border-white/15 p-4 sm:p-5 flex items-center gap-3.5"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gold/20 grid place-items-center text-gold">
                  <Icon name={s.icon} className="h-5.5 w-5.5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white leading-none">{s.value}</div>
                  <div className="text-[11px] sm:text-xs text-emerald-100/70 mt-1.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= NUSUK LIVE STRIP ================= */
function NusukLiveStrip() {
  const [data, setData] = useState<NusukPublicData | null>(null);

  useEffect(() => {
    apiGet<NusukPublicData>("/api/nusuk/public").then(setData).catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <section aria-label="Status integrasi Nusuk" className="border-b bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
        <Reveal>
          <div className="glass rounded-2xl border border-border/60 shadow-sm p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center gap-3.5">
            <div className="flex items-center gap-3 shrink-0">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              <div className="leading-tight">
                <p className="font-bold text-sm">Nusuk Live</p>
                <p className="text-[11px] text-muted-foreground">Status integrasi platform Nusuk</p>
              </div>
            </div>
            <div className="hidden lg:block h-9 w-px bg-border shrink-0" aria-hidden="true" />
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                  data.connection.environment === "SANDBOX"
                    ? "border-gold/50 bg-gold/10 text-gold-deep"
                    : "border-primary/40 bg-primary/10 text-primary"
                )}
              >
                <Icon name="keyround" className="h-3 w-3 shrink-0" />
                {data.connection.environment}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary">
                <Icon name="shield-check" className="h-3 w-3 shrink-0" />
                {data.metrics.permitsActive} izin aktif
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Icon name="timer" className="h-3 w-3 shrink-0 text-gold-deep" />
                Sinkron terakhir {timeAgo(data.connection.lastSyncAt)}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("nusuk")}
              aria-label="Buka halaman Nusuk Hub"
              className="lg:ml-auto shrink-0 bg-gradient-to-r from-primary to-forest text-white"
            >
              Buka Nusuk Hub
              <Icon name="arrow-right" className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= NUSUK BAR ================= */
function NusukBar() {
  const points = [
    "Terintegrasi Nusuk Saudi",
    "Kuota & Jadwal Terverifikasi",
    "Sistem Booking Real Time",
    "Data Jamaah Terverifikasi",
    "Terhubung dengan Kemenag RI",
    "Compliance dengan Standar Saudi",
  ];
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gold grid place-items-center">
              <Icon name="landmark" className="h-5 w-5 text-forest-deep" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm">MUHDIN — Operator Nusuk Indonesia</p>
              <p className="text-[11px] text-emerald-100/75">Official Operator from Indonesia</p>
            </div>
          </div>
          <div className="hidden lg:block h-10 w-px bg-white/20" />
          <div className="flex flex-wrap justify-center gap-2">
            {points.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium"
              >
                <Icon name="check-circle-2" className="h-3.5 w-3.5 text-gold" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= EKOSISTEM ================= */
function EcosystemSection({ ecosystems }: { ecosystems: Ecosystem[] }) {
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Arsitektur Layanan"
          title="13 Ekosistem MUHDIN"
          subtitle="Syurga bagi pengusaha pelayan Tamu Allah dan kenyamanan jamaah dalam ibadah — satu rangkaian utuh perjalanan, dari titik masuk pertama hingga kepulangan."
        />
        <div className="mt-14 space-y-10">
          {CLUSTERS.map((cluster, ci) => {
            const items = ecosystems.filter((e) => e.cluster === cluster.name);
            return (
              <div key={cluster.name}>
                <Reveal className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                    <Icon name={cluster.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{cluster.name}</h3>
                    <p className="text-xs text-muted-foreground">{cluster.range} — {cluster.description}</p>
                  </div>
                </Reveal>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {items.map((e, i) => (
                    <Reveal key={e.id} delay={i * 0.05}>
                      <button
                        onClick={() => navigate("ekosistem")}
                        className="group h-full w-full text-left rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
                      >
                        <div className="flex items-start justify-between">
                          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-forest grid place-items-center text-gold-soft shadow-md">
                            <Icon name={e.icon} className="h-5 w-5" />
                          </div>
                          <span className="text-3xl font-extrabold text-primary/10 group-hover:text-gold/40 transition-colors">
                            {String(e.number).padStart(2, "0")}
                          </span>
                        </div>
                        <h4 className="mt-4 font-bold text-sm leading-snug">{e.name}</h4>
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{e.scope}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Selengkapnya <Icon name="chevron-right" className="h-3 w-3" />
                        </span>
                      </button>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================= ALUR PERJALANAN PREVIEW ================= */
function JourneySection({ steps }: { steps: JourneyStep[] }) {
  return (
    <section className="py-20 bg-forest-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow="End-to-End Journey"
          title="Alur 13 Tahap Perjalanan Jamaah"
          subtitle="Zero-gap handover: tidak ada perpindahan tanggung jawab tanpa rekaman dan konfirmasi digital. Seluruh rombongan terpantau dari satu dashboard."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {steps.slice(0, 8).map((s, i) => (
            <Reveal key={s.id} delay={i * 0.04}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 hover:border-gold/40 transition-all">
                <div className="flex items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-full bg-gold text-forest-deep grid place-items-center font-extrabold text-sm">
                    {s.step}
                  </span>
                  <Icon name={s.icon} className="h-4 w-4 text-gold" />
                  <h4 className="font-semibold text-sm">{s.title}</h4>
                </div>
                <p className="mt-2.5 text-xs text-emerald-100/65 leading-relaxed line-clamp-2">{s.activity}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("alur")}
            className="border-gold/50 text-gold hover:bg-gold hover:text-forest-deep"
          >
            Lihat 13 Tahap Lengkap
            <Icon name="arrow-right" className="h-4 w-4 ml-2" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= MITRA ================= */
function PartnersSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="5 Mitra Utama"
          title="Punggung Industri Penyelenggaraan Ibadah Indonesia"
          subtitle="Setiap mitra mempertahankan identitas dan fungsi bisnisnya, sekaligus menerima standar layanan, teknologi bersama, dan penjaminan mutu dari ekosistem."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.code} delay={i * 0.07}>
              <div className="group h-full rounded-2xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold/50">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-forest to-primary grid place-items-center text-gold shadow-md group-hover:scale-110 transition-transform">
                  <Icon name={p.icon} className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-extrabold text-primary tracking-wide">{p.name}</h3>
                <p className="mt-1 text-[11px] font-semibold text-foreground/80 uppercase tracking-wide">{p.fullName}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{p.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= NILAI UTAMA ================= */
function ValuesSection() {
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nilai Utama MUHDIN"
          title="Lima Nilai yang Dapat Diaudit"
          subtitle="Setiap nilai diturunkan menjadi makna operasional yang dapat diamati, diukur, dan diaudit — nilai bukan slogan, melainkan standar kerja sehari-hari."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CORE_VALUES.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.07}>
              <div className="h-full rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gold/15 grid place-items-center text-gold-deep">
                    <Icon name={v.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold">{v.name}</h3>
                </div>
                <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed">{v.meaning}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TEKNOLOGI ================= */
function TechSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Dukungan Teknologi Digital"
            title="Enam Pilar Teknologi Terpadu"
            subtitle="Seluruh pilar berjalan di atas satu arsitektur data yang menempatkan profil jamaah sebagai entitas tunggal dari registrasi hingga kepulangan — dengan enkripsi dan pembatasan akses berbasis peran."
          />
          <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
            {["Persetujuan eksplisit", "Minimasi data", "Enkripsi end-to-end", "Audit keamanan independen"].map((t) => (
              <Badge key={t} variant="secondary" className="text-xs">
                <Icon name="shield-check" className="h-3 w-3 mr-1 text-primary" />
                {t}
              </Badge>
            ))}
          </Reveal>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          {TECH_PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div className="h-full rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all">
                <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                  <Icon name={p.icon} className="h-5 w-5" />
                </div>
                <h4 className="mt-3 font-bold text-sm">{p.name}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ROADMAP ================= */
function RoadmapSection({ roadmap }: { roadmap: Roadmap[] }) {
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Peta Jalan 2026-2030"
          title="Empat Fase Menuju Skala Penuh"
          subtitle="Bertahap dan berbasis bukti — setiap fase memiliki deliverables yang dapat diverifikasi sebelum fase berikutnya dimulai."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {roadmap.map((r, i) => (
            <Reveal key={r.id} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border bg-card p-6 shadow-sm overflow-hidden">
                <span className="absolute -right-3 -top-4 text-7xl font-extrabold text-primary/5 select-none">
                  {i + 1}
                </span>
                <Badge className="bg-gold/15 text-gold-deep border-gold/30 hover:bg-gold/25">{r.period}</Badge>
                <h3 className="mt-3 font-extrabold text-primary">{r.phase}</h3>
                <p className="mt-1 text-xs font-semibold text-foreground/70">{r.focus}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{r.deliverables}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= MANFAAT ================= */
function BenefitsSection() {
  return (
    <section className="py-16 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Manfaat untuk Jamaah, PPIU, KBIHU &amp; Stakeholder</h2>
          <div className="gold-divider w-40 mx-auto mt-4" />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {BENEFITS.map((b, i) => (
            <Reveal key={b} delay={i * 0.04}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Icon name="check-circle-2" className="h-4 w-4 text-gold" />
                {b}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONI ================= */
function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Testimoni"
          title="Kepercayaan adalah Aset Kolektif"
          subtitle="Suara jamaah dan mitra yang merasakan langsung layanan ekosistem MUHDIN."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <div className="h-full rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
                <Icon name="quote" className="h-7 w-7 text-gold/60" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-forest grid place-items-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, s) => (
                      <Icon key={s} name="star" className="h-3.5 w-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= BERITA TERBARU ================= */
function LatestNews({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Kabar Terbaru"
            title="Berita & Pengumuman"
          />
          <Reveal>
            <Button variant="ghost" onClick={() => navigate("berita")} className="hidden sm:inline-flex text-primary">
              Semua Berita <Icon name="arrow-right" className="h-4 w-4 ml-1" />
            </Button>
          </Reveal>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.07}>
              <button
                onClick={() => navigate(`berita/${a.slug}`)}
                className="group h-full w-full text-left rounded-2xl border bg-card overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  { }
                  <img
                    src={a.cover || "/images/hero-kaaba.jpg"}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-forest-deep/85 text-gold-soft backdrop-blur-sm border-none">
                    {a.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="calendar" className="h-3.5 w-3.5" />
                    {formatDate(a.createdAt)}
                  </div>
                  <h3 className="mt-2 font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function JoinCTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest via-primary to-forest-deep p-10 sm:p-14 text-center shadow-2xl">
            <div className="absolute inset-0 bg-islamic-pattern-gold opacity-50" />
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl animate-float-soft" />
            <div className="relative">
              <p className="font-arabic text-2xl text-gold" dir="rtl">{BRAND.arabic}</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Bersama Melayani Tamu Allah,<br />
                <span className="text-gold-gradient">Sampai Rumah dengan Selamat</span>
              </h2>
              <p className="mt-4 text-emerald-50/85 max-w-2xl mx-auto">
                PPIU, PIHK, KBIHU, IPHI, dan Travel Wisata Halal-Ziarah — satukan langkah dalam
                satu ekosistem yang amanah, profesional, dan terdigitalisasi.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("gabung")}
                  className="bg-gradient-to-r from-gold-deep to-gold text-forest-deep font-bold h-12 px-8 hover:brightness-110"
                >
                  <Icon name="handshake" className="h-5 w-5 mr-2" />
                  Daftar Keanggotaan
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("kontak")}
                  className="border-white/30 text-white hover:bg-white/10 h-12 px-8"
                >
                  Hubungi Kami
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= MAIN ================= */
export function HomeView() {
  const [data, setData] = useState<{
    ecosystems: Ecosystem[];
    steps: JourneyStep[];
    roadmap: Roadmap[];
    testimonials: Testimonial[];
    articles: Article[];
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiGet<Ecosystem[]>("/api/ecosystems"),
      apiGet<JourneyStep[]>("/api/journey"),
      apiGet<Roadmap[]>("/api/roadmap"),
      apiGet<Testimonial[]>("/api/testimonials"),
      apiGet<Article[]>("/api/articles?limit=3"),
    ])
      .then(([ecosystems, steps, roadmap, testimonials, articles]) =>
        setData({ ecosystems, steps, roadmap, testimonials, articles })
      )
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div className="py-24 text-center">
        <Icon name="alert-triangle" className="h-10 w-10 mx-auto text-destructive" />
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          <Icon name="rotate" className="h-4 w-4 mr-2" /> Muat Ulang
        </Button>
      </div>
    );
  }

  if (!data) return <LoadingSkeleton />;

  return (
    <div className={cn("flex flex-col")}>
      <Hero />
      <NusukLiveStrip />
      <NusukBar />
      <EcosystemSection ecosystems={data.ecosystems} />
      <JourneySection steps={data.steps} />
      <PartnersSection />
      <ValuesSection />
      <TechSection />
      <RoadmapSection roadmap={data.roadmap} />
      <BenefitsSection />
      <TestimonialSection testimonials={data.testimonials} />
      <LatestNews articles={data.articles} />
      <JoinCTA />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 pb-10">
      <div className="h-[520px] w-full bg-forest-deep/90" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
        <Skeleton className="h-8 w-72 mx-auto" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
