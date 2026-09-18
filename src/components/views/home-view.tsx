"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { apiGet } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading, Stagger, StaggerItem, CountUp } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PARTNERS, CORE_VALUES, TECH_PILLARS, CLUSTERS, BRAND } from "@/lib/constants";
import { useT, formatDateL10n, formatNumberL10n, type Locale } from "@/lib/i18n";
import type { Ecosystem, JourneyStep, Roadmap, Testimonial, Article, NusukPublicData } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Pemetaan ikon/urutan (dari lib/constants.ts) → key kamus. Ikon & warna tetap di kode. */
/* Task 21 — statistik hero: angka nyata untuk animasi CountUp (24/7 tetap teks) */
const HERO_STATS: { k: string; icon: string; num?: number; suffix?: string }[] = [
  { k: "jamaah", icon: "users", num: 1_000_000, suffix: "+" },
  { k: "mitra", icon: "handshake", num: 1_000, suffix: "+" },
  { k: "sdm", icon: "badge-check", num: 10_000 },
  { k: "command", icon: "shield-check" },
];

/* Task 21 — kurva easing premium untuk koreografi hero */
const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];
const CLUSTER_KEYS = ["akses", "ibadah", "mutu"] as const;
const PARTNER_KEYS = ["ppiu", "pihk", "kbihu", "iphi", "tw"] as const;
const VALUE_KEYS = ["amanah", "profesional", "terintegrasi", "transparan", "tepercaya"] as const;
const PILLAR_KEYS = ["app", "gps", "ai", "nusuk", "dashboard", "multiBahasa"] as const;
const PRIVACY_KEYS = ["priv1", "priv2", "priv3", "priv4"] as const;
const BENEFIT_KEYS = ["b1", "b2", "b3", "b4", "b5", "b6", "b7"] as const;
const NUSUK_BAR_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;

/* timeAgo versi i18n (label & satuan lewat kamus, angka via formatNumberL10n). */
function timeAgoL10n(
  iso: string | null | undefined,
  t: (key: string, vars?: Record<string, string | number>) => string,
  locale: Locale
) {
  if (!iso) return t("home.nusukLive.belumSinkron");
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const s = Math.max(1, Math.floor(diff / 1000));
    if (s < 60) return t("home.nusukLive.detik", { n: formatNumberL10n(s, locale) });
    const m = Math.floor(s / 60);
    if (m < 60) return t("home.nusukLive.menit", { n: formatNumberL10n(m, locale) });
    const h = Math.floor(m / 60);
    if (h < 24) return t("home.nusukLive.jam", { n: formatNumberL10n(h, locale) });
    const d = Math.floor(h / 24);
    return t("home.nusukLive.hari", { n: formatNumberL10n(d, locale) });
  } catch {
    return iso;
  }
}

/* ================= HERO — Task 21 sinematik ala McKinsey ================= */
function Hero() {
  const { t, locale } = useT();
  const ref = useRef<HTMLElement | null>(null);

  /* Parallax: konten naik & memudar, latar bergeser lebih lambat saat digulir */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  /* Marquee MUDAH. MURAH. AMANAH. — dua paritan identik utk loop mulus */
  const MOTTO_KEYS = ["motto1", "motto2", "motto3"] as const;
  const marqueeSeq = Array.from({ length: 3 }, () => MOTTO_KEYS).flat();

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Latar: Ken Burns sinematik + parallax lembut */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <img
          src="/images/hero-kaaba.jpg"
          alt={t("home.hero.imgAlt")}
          className="animate-ken-burns h-full w-full object-cover bg-gradient-to-br from-forest-deep to-forest"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/90 via-forest-deep/75 to-forest-deep/95" />
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-60" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24 sm:py-32 lg:py-36"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Badge className="mb-5 bg-gold/20 text-gold-soft border border-gold/40 hover:bg-gold/30 hover:text-gold-soft px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide max-w-full">
              <Icon name="sparkles" className="h-3.5 w-3.5 mr-1.5 shrink-0" />
              <span className="truncate">{t("home.hero.badge")}</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-white"
          >
            {t("home.hero.title1")}{" "}
            <span className="text-gold-gradient">{t("home.hero.titleGold")}</span>{" "}
            {t("home.hero.title2")}
          </motion.h1>

          {/* Task 21 — SYURGA TRAVEL · PELAYAN TAMU ALLAH (menggantikan kalimat motto) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.34, ease: EASE }}
            className="mt-7"
          >
            <p className="text-2xl sm:text-3xl lg:text-[2.6rem] font-black leading-tight tracking-[0.02em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]">
              {t("home.hero.brandName")}
            </p>
            <p className="mt-2 flex items-center gap-3 text-lg sm:text-xl lg:text-2xl font-extrabold">
              <span
                aria-hidden
                className="h-px w-10 shrink-0 bg-gradient-to-r from-gold to-transparent rtl:bg-gradient-to-l"
              />
              <span className="text-gold-gradient">{t("home.hero.brandTag")}</span>
            </p>
          </motion.div>

          {/* Task 21 — MUDAH. MURAH. AMANAH. teks berjalan agar mudah dibaca */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.46, ease: EASE }}
            className="mt-7 max-w-xl"
          >
            <p className="sr-only">{t("home.hero.mottoAria")}</p>
            <div
              aria-hidden="true"
              dir="ltr"
              className="marquee-hover-pause marquee-mask relative overflow-hidden rounded-2xl border border-gold/25 bg-forest-deep/50 py-3.5 backdrop-blur-md"
            >
              <div
                className="animate-marquee flex w-max items-center"
                style={{ "--marquee-duration": "22s" } as React.CSSProperties}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} className="flex items-center">
                    {marqueeSeq.map((k, i) => (
                      <span key={`${copy}-${i}`} className="flex items-center whitespace-nowrap">
                        <span className="px-5 text-base sm:text-lg font-extrabold tracking-[0.16em] text-white">
                          {t(`home.hero.${k}`)}
                        </span>
                        <span className="text-sm text-gold">✦</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.56, ease: EASE }}
            className="mt-6 text-lg text-emerald-50/85 leading-relaxed max-w-2xl"
          >
            {t("home.hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.66, ease: EASE }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              onClick={() => navigate("ekosistem")}
              className="bg-gradient-to-r from-gold to-gold-soft text-forest-deep font-bold shadow-xl hover:brightness-105 h-12 px-7 text-base"
            >
              {t("home.hero.ctaEcosystems")}
              <Icon name="arrow-right" className="h-4 w-4 ms-2 icon-flip" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("anggota")}
              className="bg-transparent border-emerald-100/40 text-white hover:bg-white/10 hover:text-white h-12 px-7 text-base"
            >
              <Icon name="shield-check" className="h-4 w-4 me-2" />
              {t("home.hero.ctaVerify")}
            </Button>
          </motion.div>
        </div>

        {/* Floating stats — CountUp sinematik dgn cascade premium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
          className="mt-14"
        >
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" stagger={0.1}>
            {HERO_STATS.map((s) => (
              <StaggerItem key={s.k}>
                <div className="h-full rounded-2xl border border-white/15 bg-forest-deep/40 backdrop-blur-md p-4 sm:p-5 flex items-center gap-3.5">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gold/20 grid place-items-center text-gold">
                    <Icon name={s.icon} className="h-5.5 w-5.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl sm:text-2xl font-extrabold text-white leading-none whitespace-nowrap">
                      {s.num != null ? (
                        <CountUp value={s.num} suffix={s.suffix ?? ""} locale={locale} />
                      ) : (
                        t(`home.stats.${s.k}.value`)
                      )}
                    </div>
                    <div className="text-[11px] sm:text-xs text-emerald-100/70 mt-1.5">
                      {t(`home.stats.${s.k}.label`)}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </motion.div>
      </motion.div>

      {/* Petunjuk gulir — chevron menetes lembut */}
      <div
        aria-hidden
        className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:block text-gold/80"
      >
        <Icon name="chevron-down" className="animate-scroll-hint h-6 w-6" />
      </div>
    </section>
  );
}

/* ================= NUSUK LIVE STRIP ================= */
function NusukLiveStrip() {
  const { t, locale } = useT();
  const [data, setData] = useState<NusukPublicData | null>(null);

  useEffect(() => {
    apiGet<NusukPublicData>(`/api/nusuk/public?locale=${locale}`).then(setData).catch(() => {});
  }, [locale]);

  if (!data) return null;

  return (
    <section aria-label={t("home.nusukLive.aria")} className="border-b bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5">
        <Reveal>
          <div className="glass rounded-2xl border border-border/60 shadow-sm p-4 sm:px-5 flex flex-col lg:flex-row lg:items-center gap-3.5">
            <div className="flex items-center gap-3 shrink-0">
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
              </span>
              <div className="leading-tight">
                <p className="font-bold text-sm">{t("home.nusukLive.label")}</p>
                <p className="text-[11px] text-muted-foreground">{t("home.nusukLive.sub")}</p>
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
                {t("home.nusukLive.izinAktif", { n: formatNumberL10n(data.metrics.permitsActive, locale) })}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                <Icon name="timer" className="h-3 w-3 shrink-0 text-gold-deep" />
                {t("home.nusukLive.sinkronTerakhir", {
                  time: timeAgoL10n(data.connection.lastSyncAt, t, locale),
                })}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("nusuk")}
              aria-label={t("home.nusukLive.btnAria")}
              className="lg:ms-auto shrink-0 bg-gradient-to-r from-primary to-forest text-white"
            >
              {t("home.nusukLive.btn")}
              <Icon name="arrow-right" className="h-4 w-4 ms-1.5 icon-flip" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= NUSUK BAR ================= */
function NusukBar() {
  const { t } = useT();
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gold grid place-items-center">
              <Icon name="landmark" className="h-5 w-5 text-forest-deep" strokeWidth={2.4} />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm">{t("home.nusukBar.title")}</p>
              <p className="text-[11px] text-emerald-50/90">{t("home.nusukBar.sub")}</p>
            </div>
          </div>
          <div className="hidden lg:block h-10 w-px bg-white/20" />
          <div className="flex flex-wrap justify-center gap-2">
            {NUSUK_BAR_KEYS.map((k) => (
              <span
                key={k}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium"
              >
                <Icon name="check-circle-2" className="h-3.5 w-3.5 text-gold-soft" />
                {t(`home.nusukBar.${k}`)}
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
  const { t } = useT();
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("home.ekosistem.eyebrow")}
          title={t("home.ekosistem.title")}
          subtitle={t("home.ekosistem.subtitle")}
        />
        <div className="mt-14 space-y-10">
          {CLUSTERS.map((cluster, ci) => {
            const k = CLUSTER_KEYS[ci];
            const items = ecosystems.filter((e) => e.cluster === cluster.name);
            return (
              <div key={cluster.name}>
                <Reveal className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                    <Icon name={cluster.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{t(`home.klaster.${k}.name`)}</h3>
                    <p className="text-xs text-muted-foreground">
                      {t(`home.klaster.${k}.range`)} — {t(`home.klaster.${k}.desc`)}
                    </p>
                  </div>
                </Reveal>
                <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" stagger={0.06}>
                  {items.map((e) => (
                    <StaggerItem key={e.id}>
                      <button
                        onClick={() => navigate("ekosistem")}
                        className="group h-full w-full text-start rounded-2xl border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
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
                          {t("home.umum.selengkapnya")} <Icon name="chevron-right" className="h-3 w-3 icon-flip" />
                        </span>
                      </button>
                    </StaggerItem>
                  ))}
                </Stagger>
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
  const { t } = useT();
  return (
    <section className="py-20 bg-forest-deep text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow={t("home.alur.eyebrow")}
          title={t("home.alur.title")}
          subtitle={t("home.alur.subtitle")}
        />
        <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" stagger={0.05}>
          {steps.slice(0, 8).map((s) => (
            <StaggerItem key={s.id}>
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
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("alur")}
            className="border-gold/50 text-gold hover:bg-gold hover:text-forest-deep"
          >
            {t("home.alur.cta")}
            <Icon name="arrow-right" className="h-4 w-4 ms-2 icon-flip" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= MITRA ================= */
function PartnersSection() {
  const { t } = useT();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("home.mitra.eyebrow")}
          title={t("home.mitra.title")}
          subtitle={t("home.mitra.subtitle")}
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
          {PARTNERS.map((p, i) => {
            const k = PARTNER_KEYS[i];
            return (
              <StaggerItem key={p.code}>
                <div className="group h-full rounded-2xl border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-gold/50">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-forest to-primary grid place-items-center text-gold-soft shadow-md group-hover:scale-110 transition-transform">
                    <Icon name={p.icon} className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-extrabold text-primary tracking-wide">{t(`home.mitra.${k}.name`)}</h3>
                  <p className="mt-1 text-[11px] font-semibold text-foreground/80 uppercase tracking-wide">
                    {t(`home.mitra.${k}.fullName`)}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t(`home.mitra.${k}.role`)}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= NILAI UTAMA ================= */
function ValuesSection() {
  const { t } = useT();
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("home.nilai.eyebrow")}
          title={t("home.nilai.title")}
          subtitle={t("home.nilai.subtitle")}
        />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.08}>
          {CORE_VALUES.map((v, i) => {
            const k = VALUE_KEYS[i];
            return (
              <StaggerItem key={k}>
                <div className="h-full rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold/15 grid place-items-center text-gold-deep">
                      <Icon name={v.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="font-extrabold">{t(`home.nilai.${k}.name`)}</h3>
                  </div>
                  <p className="mt-3.5 text-xs text-muted-foreground leading-relaxed">
                    {t(`home.nilai.${k}.meaning`)}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= TEKNOLOGI ================= */
function TechSection() {
  const { t } = useT();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading
            align="left"
            eyebrow={t("home.teknologi.eyebrow")}
            title={t("home.teknologi.title")}
            subtitle={t("home.teknologi.subtitle")}
          />
          <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
            {PRIVACY_KEYS.map((k) => (
              <Badge key={k} variant="secondary" className="text-xs">
                <Icon name="shield-check" className="h-3 w-3 mr-1 text-primary" />
                {t(`home.teknologi.${k}`)}
              </Badge>
            ))}
          </Reveal>
        </div>
        <Stagger className="grid gap-3.5 sm:grid-cols-2" stagger={0.07}>
          {TECH_PILLARS.map((p, i) => {
            const k = PILLAR_KEYS[i];
            return (
              <StaggerItem key={k}>
                <div className="h-full rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </div>
                  <h4 className="mt-3 font-bold text-sm">{t(`home.teknologi.${k}.name`)}</h4>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {t(`home.teknologi.${k}.desc`)}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= ROADMAP ================= */
function RoadmapSection({ roadmap }: { roadmap: Roadmap[] }) {
  const { t } = useT();
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("home.roadmap.eyebrow")}
          title={t("home.roadmap.title")}
          subtitle={t("home.roadmap.subtitle")}
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4" stagger={0.09}>
          {roadmap.map((r, i) => (
            <StaggerItem key={r.id}>
              <div className="relative h-full rounded-2xl border bg-card p-6 shadow-sm overflow-hidden">
                <span aria-hidden className="absolute -right-3 -top-4 text-7xl font-extrabold text-primary/5 select-none">
                  {i + 1}
                </span>
                <Badge className="bg-gold/15 text-gold-deep border-gold/30 hover:bg-gold/25">{r.period}</Badge>
                <h3 className="mt-3 font-extrabold text-primary">{r.phase}</h3>
                <p className="mt-1 text-xs font-semibold text-foreground/70">{r.focus}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{r.deliverables}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= MANFAAT ================= */
function BenefitsSection() {
  const { t } = useT();
  return (
    <section className="py-16 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold">{t("home.manfaat.title")}</h2>
          <div className="gold-divider w-40 mx-auto mt-4" />
        </div>
        <Stagger className="mt-8 flex flex-wrap justify-center gap-2.5" stagger={0.04}>
          {BENEFIT_KEYS.map((k) => (
            <StaggerItem key={k}>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Icon name="check-circle-2" className="h-4 w-4 text-gold-soft" />
                {t(`home.manfaat.${k}`)}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= TESTIMONI ================= */
function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useT();
  if (!testimonials.length) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("home.testimoni.eyebrow")}
          title={t("home.testimoni.title")}
          subtitle={t("home.testimoni.subtitle")}
        />
        <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {testimonials.slice(0, 6).map((item) => (
            <StaggerItem key={item.id}>
              <div className="h-full rounded-2xl border bg-card p-6 shadow-sm flex flex-col">
                <Icon name="quote" className="h-7 w-7 text-gold/60" />
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/85">&ldquo;{item.content}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-forest grid place-items-center text-white font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: item.rating }).map((_, s) => (
                      <Icon key={s} name="star" className="h-3.5 w-3.5 fill-gold-deep text-gold-deep" />
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= BERITA TERBARU ================= */
function LatestNews({ articles }: { articles: Article[] }) {
  const { t, locale } = useT();
  if (!articles.length) return null;
  return (
    <section className="py-20 bg-mint/30 dark:bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow={t("home.berita.eyebrow")}
            title={t("home.berita.title")}
          />
          <Reveal>
            <Button variant="ghost" onClick={() => navigate("berita")} className="hidden sm:inline-flex text-primary">
              {t("home.berita.semua")} <Icon name="arrow-right" className="h-4 w-4 ms-1 icon-flip" />
            </Button>
          </Reveal>
        </div>
        <Stagger className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.09}>
          {articles.map((a) => (
            <StaggerItem key={a.id}>
              <button
                onClick={() => navigate(`berita/${a.slug}`)}
                className="group h-full w-full text-start rounded-2xl border bg-card overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-44 overflow-hidden">
                  { }
                  <img
                    src={a.cover || "/images/hero-kaaba.jpg"}
                    alt={a.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 start-3 bg-forest-deep text-gold-soft border-none">
                    {a.category}
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="calendar" className="h-3.5 w-3.5" />
                    {formatDateL10n(a.createdAt, locale)}
                  </div>
                  <h3 className="mt-2 font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{a.excerpt}</p>
                </div>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= CTA ================= */
function JoinCTA() {
  const { t } = useT();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest-deep via-forest-deep to-forest p-10 sm:p-14 text-center shadow-2xl">
            <div className="absolute inset-0 bg-islamic-pattern-gold opacity-50" />
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl animate-float-soft" />
            <div className="relative">
              <p className="font-arabic text-2xl text-gold" dir="rtl">{BRAND.arabic}</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {t("home.cta.title1")}<br />
                <span className="text-gold-gradient">{t("home.cta.titleGold")}</span>
              </h2>
              <p className="mt-4 text-emerald-50/85 max-w-2xl mx-auto">
                {t("home.cta.body")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate("gabung")}
                  className="bg-gradient-to-r from-gold to-gold-soft text-forest-deep font-bold h-12 px-8 hover:brightness-105"
                >
                  <Icon name="handshake" className="h-5 w-5 me-2" />
                  {t("home.cta.btnDaftar")}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("kontak")}
                  className="border-white/30 text-white hover:bg-white/10 h-12 px-8"
                >
                  {t("home.cta.btnKontak")}
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
  const { t, locale } = useT();
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
      apiGet<Ecosystem[]>(`/api/ecosystems?locale=${locale}`),
      apiGet<JourneyStep[]>(`/api/journey?locale=${locale}`),
      apiGet<Roadmap[]>(`/api/roadmap?locale=${locale}`),
      apiGet<Testimonial[]>(`/api/testimonials?locale=${locale}`),
      apiGet<Article[]>(`/api/articles?limit=3&locale=${locale}`),
    ])
      .then(([ecosystems, steps, roadmap, testimonials, articles]) =>
        setData({ ecosystems, steps, roadmap, testimonials, articles })
      )
      .catch((e) => setError(e.message));
  }, [locale]);

  if (error) {
    return (
      <div className="py-24 text-center">
        <Icon name="alert-triangle" className="h-10 w-10 mx-auto text-destructive" />
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          <Icon name="rotate" className="h-4 w-4 me-2" /> {t("home.umum.muatUlang")}
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
