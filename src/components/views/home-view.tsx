"use client";

/* Task 33-b — Rebuild homepage MUHDIN NUSANTARA (11 section + news strip).
   SPA hash-routing publik; animasi via Reveal/Stagger + CSS murni di
   nusantara.css (reduced-motion aman). Tanpa API fetch kecuali news strip. */
import "@/components/site/nusantara.css";

import { Fragment, useEffect, useRef, useState } from "react";
import { apiGet } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BRAND } from "@/lib/constants";
import {
  HERO_FLOW,
  PILLARS,
  ECOSYSTEM_CATEGORIES,
  ONBOARDING_STEPS,
  NETWORK_NODES,
  MEMBERSHIP_TIERS,
  ACADEMY_TOPICS,
} from "@/lib/nusantara";
import { useT, formatDateL10n } from "@/lib/i18n";
import type { Article } from "@/lib/types";
import { cn } from "@/lib/utils";

/* ---------- Pemetaan konstanta nusantara.ts → ikon & key kamus ---------- */

const FLOW_META: Record<string, { icon: string; key: string }> = {
  INDONESIA: { icon: "map-pin", key: "indonesia" },
  MUHDIN: { icon: "hexagon", key: "muhdin" },
  PPIU_PIHK: { icon: "plane-takeoff", key: "ppiuPihk" },
  SAUDI: { icon: "building-2", key: "saudi" },
  JAMAAH: { icon: "heart-handshake", key: "jamaah" },
};

const PILLAR_META: Record<string, { icon: string; key: string }> = {
  CONNECT: { icon: "network", key: "connect" },
  VERIFY: { icon: "shield-check", key: "verify" },
  COLLABORATE: { icon: "handshake", key: "collaborate" },
  INTEGRATE: { icon: "workflow", key: "integrate" },
};

const ECO_KEY: Record<string, string> = {
  PPIU: "ppiu",
  PIHK: "pihk",
  KBIHU: "kbihu",
  TRAVEL: "travel",
  SAUDI_PROVIDER: "saudiProvider",
  HOTEL: "hotel",
  TICKETING: "ticketing",
  VISA_DOC: "visaDoc",
  TRANSPORT: "transport",
  INSURANCE: "insurance",
  HEALTH: "health",
  PROFESSIONAL: "professional",
  TECHNOLOGY: "technology",
  STRATEGIC_PARTNER: "strategicPartner",
};

const STEP_META: Record<string, { icon: string; key: string }> = {
  REGISTER: { icon: "user-plus", key: "register" },
  COMPLETE_PROFILE: { icon: "clipboard-list", key: "completeProfile" },
  DOCUMENT_REVIEW: { icon: "file-text", key: "documentReview" },
  VERIFICATION: { icon: "shield-check", key: "verification" },
  MUHDIN_ID: { icon: "fingerprint", key: "muhdinId" },
  CONNECT: { icon: "network", key: "connect" },
  COLLABORATE: { icon: "handshake", key: "collaborate" },
};

const NODE_META: Record<string, string> = {
  PPIU: "plane-takeoff",
  PIHK: "landmark",
  KBIHU: "users",
  SUPPLIER: "boxes",
  SAUDI: "building-2",
  PROFESSIONAL: "graduation-cap",
  TECHNOLOGY: "brain-circuit",
  PARTNER: "handshake",
  JAMAAH: "heart-handshake",
};

const NODE_KEY: Record<string, string> = {
  PPIU: "ppiu",
  PIHK: "pihk",
  KBIHU: "kbihu",
  SUPPLIER: "supplier",
  SAUDI: "saudi",
  PROFESSIONAL: "professional",
  TECHNOLOGY: "technology",
  PARTNER: "partner",
  JAMAAH: "jamaah",
};

const TIER_KEY: Record<string, string> = {
  INDIVIDUAL: "individual",
  PROFESSIONAL: "professional",
  ORGANIZATION: "organization",
  PPIU_PIHK: "ppiuPihk",
  STRATEGIC_PARTNER: "strategicPartner",
};

const TOPIC_META: Record<string, { icon: string; key: string }> = {
  DIGITAL_UMRAH: { icon: "book-open", key: "digitalUmrah" },
  PPIU_OPERATIONS: { icon: "graduation-cap", key: "ppiuOps" },
  SAUDI_OPERATIONS: { icon: "landmark", key: "saudiOps" },
  COMPLIANCE: { icon: "scale", key: "compliance" },
  TECHNOLOGY: { icon: "brain-circuit", key: "technology" },
  PROFESSIONAL_DEVELOPMENT: { icon: "trending-up", key: "professionalDev" },
};

const NOT_KEYS = ["govt", "accredit", "departure", "visa", "transaction"] as const;

/* Posisi radial 9 node jaringan (dihitung sekali, aman SSR). */
const NODE_POS = NETWORK_NODES.map((code, i) => {
  const angle = (i / NETWORK_NODES.length) * Math.PI * 2 - Math.PI / 2;
  return { code, x: 50 + 41 * Math.cos(angle), y: 50 + 39 * Math.sin(angle) };
});

/* ---------- Hook ringan: viewport sekali (pemicu kelas .is-inview) ---------- */
function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      // Fallback env tanpa IO: tampilkan animasi via rAF (hindari setState sinkron).
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-40px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/* ================= S01 — HERO ================= */
function HeroSection() {
  const { t } = useT();
  return (
    <section
      aria-label={t("nusHome.aria.hero")}
      className="relative overflow-hidden bg-gradient-to-br from-forest-deep via-forest-deep to-forest"
    >
      {/* Latar foto Kaaba + overlay forest gelap → transparan (gradient jadi fallback) */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-kaaba.jpg"
          alt={t("nusHome.hero.imgAlt")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/95 via-forest-deep/70 to-forest-deep/90" aria-hidden />
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" aria-hidden />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <Reveal>
          <Badge className="border border-gold/40 bg-gold/15 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-gold-soft sm:text-xs">
            {BRAND.positioning.toUpperCase()}
          </Badge>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            {BRAND.fullName}
          </h1>
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-4 text-base font-semibold italic text-gold sm:text-lg">
            {BRAND.taglineEn}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-emerald-100/85 sm:text-base">
            {t("nusHome.hero.subtitle")}
          </p>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => navigate("daftar")}
              className="h-12 w-full bg-gold px-8 text-sm font-extrabold tracking-widest text-forest-deep hover:bg-gold-soft sm:w-auto"
            >
              {t("nusHome.hero.ctaPrimary")}
              <Icon name="arrow-right" className="ms-2 h-4 w-4 icon-flip" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("ekosistem")}
              className="h-12 w-full border-gold/50 bg-white/5 px-8 text-sm font-bold tracking-widest text-white hover:border-gold hover:bg-white/10 hover:text-gold sm:w-auto"
            >
              {t("nusHome.hero.ctaSecondary")}
            </Button>
          </div>
        </Reveal>

        {/* Alur ekosistem animasi: 5 node + konektor "pulse mengalir" */}
        <div className="mt-14 sm:mt-16">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-soft/80">
            {t("nusHome.hero.flowTitle")}
          </p>
          <div className="mx-auto mt-5 flex max-w-3xl flex-col items-center gap-1 md:flex-row md:justify-between md:gap-0">
            {HERO_FLOW.map((code, i) => {
              const meta = FLOW_META[code];
              const isHub = code === "MUHDIN";
              return (
                <Fragment key={code}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "nus-float flex h-14 w-14 items-center justify-center border backdrop-blur-sm sm:h-16 sm:w-16",
                        isHub
                          ? "nus-glow rounded-full border-gold/60 bg-gold/15 text-gold"
                          : "rounded-2xl border-white/15 bg-white/5 text-emerald-100"
                      )}
                      style={{ animationDelay: `${i * 0.4}s` }}
                    >
                      <Icon name={meta.icon} className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100/80 sm:text-[11px]">
                      {t(`nusHome.hero.flow.${meta.key}`)}
                    </span>
                  </div>
                  {i < HERO_FLOW.length - 1 && (
                    <span
                      aria-hidden
                      className="nus-connector block h-8 w-[2px] shrink-0 md:h-[2px] md:w-12 lg:w-16"
                    />
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= S02 — THE IDEA ================= */
function IdeaSection() {
  const { t } = useT();
  return (
    <section aria-label={t("nusHome.aria.idea")} className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("nusHome.idea.eyebrow")}
          title={t("nusHome.idea.title")}
          subtitle={t("nusHome.idea.sub")}
        />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {PILLARS.map((code) => {
            const meta = PILLAR_META[code];
            return (
              <StaggerItem key={code} className="h-full">
                <div className="nus-pillar group h-full rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-xl">
                  <div className="nus-pillar-icon flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-gold/15 group-hover:text-gold-deep">
                    <Icon name={meta.icon} className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold uppercase tracking-[0.18em] text-foreground">
                    {t(`nusHome.idea.pillars.${meta.key}.label`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`nusHome.idea.pillars.${meta.key}.desc`)}
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

/* ================= S03 — ECOSYSTEM (14 kategori keanggotaan) ================= */
function EcosystemSection() {
  const { t } = useT();
  return (
    <section
      aria-label={t("nusHome.aria.ecosystem")}
      className="bg-mint/30 py-16 sm:py-24 dark:bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("nusHome.eco.eyebrow")}
          title={t("nusHome.eco.title")}
          subtitle={t("nusHome.eco.sub")}
        />
        <Stagger
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5"
          stagger={0.045}
        >
          {ECOSYSTEM_CATEGORIES.map((cat) => {
            const key = ECO_KEY[cat.code];
            return (
              <StaggerItem key={cat.code} className="h-full">
                <div className="group flex h-full flex-col rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lg">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-gold/15 group-hover:text-gold-deep">
                    <Icon name={cat.icon} className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-3 text-xs font-extrabold uppercase tracking-wide text-foreground sm:text-sm">
                    {t(`nusHome.eco.items.${key}.name`)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t(`nusHome.eco.items.${key}.desc`)}
                  </p>
                  <button
                    onClick={() => navigate("daftar")}
                    className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-gold-deep transition-colors hover:text-primary"
                    aria-label={`${t("nusHome.eco.cta")} — ${t(`nusHome.eco.items.${key}.name`)}`}
                  >
                    {t("nusHome.eco.cta")}
                    <Icon name="arrow-right" className="h-3.5 w-3.5 icon-flip" />
                  </button>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ================= S04 — MUHDIN VERIFIED ================= */
function VerifiedSection() {
  const { t } = useT();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <section aria-label={t("nusHome.aria.verified")} className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("nusHome.verified.eyebrow")}
          title={t("nusHome.verified.title")}
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Badge animasi: cincin pulse + centang stroke-draw */}
          <Reveal className="flex justify-center">
            <div ref={ref} className={cn("nus-verified flex flex-col items-center", inView && "is-inview")}>
              <div className="relative flex h-44 w-44 items-center justify-center">
                <span aria-hidden className="nus-ring absolute inset-0 rounded-full border-2 border-gold/50" />
                <span aria-hidden className="nus-ring nus-ring-2 absolute inset-0 rounded-full border-2 border-gold/30" />
                <div className="nus-glow flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep shadow-xl">
                  <Icon name="shield-check" className="h-14 w-14 text-forest-deep" strokeWidth={1.6} />
                </div>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="absolute bottom-0 end-0 h-11 w-11 rounded-full bg-forest-deep p-2 shadow-lg"
                  fill="none"
                  stroke="oklch(0.84 0.09 90)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path className="nus-check-path" d="M4 12.5l5 5L20 7" />
                </svg>
              </div>
              <p className="mt-5 text-lg font-extrabold tracking-[0.18em] text-foreground">
                {t("nusHome.verified.badge")}
              </p>
            </div>
          </Reveal>

          {/* Penjelasan + panel BUKAN + disclaimer */}
          <Reveal delay={0.1}>
            <div>
              <p className="text-base leading-relaxed text-foreground/85 sm:text-lg">
                {t("nusHome.verified.meaning")}
              </p>
              <Button
                onClick={() => navigate("anggota/verifikasi")}
                className="mt-5 h-11 bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90"
              >
                <Icon name="search" className="me-2 h-4 w-4" />
                {t("nusHome.verified.cta")}
              </Button>

              <div className="mt-7 rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
                <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-destructive">
                  <Icon name="ban" className="h-4 w-4" />
                  {t("nusHome.verified.notTitle")}
                </p>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {NOT_KEYS.map((k) => (
                    <li key={k} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Icon name="ban" className="mt-0.5 h-4 w-4 shrink-0 text-destructive/80" />
                      {t(`nusHome.verified.not.${k}`)}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {t("nusHome.verified.disclaimer")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= S05 — HOW IT WORKS (timeline 7 langkah) ================= */
function HowItWorksSection() {
  const { t } = useT();
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  return (
    <section
      aria-label={t("nusHome.aria.how")}
      className="bg-mint/30 py-16 sm:py-24 dark:bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("nusHome.how.eyebrow")}
          title={t("nusHome.how.title")}
          subtitle={t("nusHome.how.sub")}
        />
        <div ref={ref} className={cn("relative mt-12 md:pb-12", inView && "nus-inview")}>
          {/* Garis dasar + garis progres (vertikal HP, horizontal desktop) */}
          <span
            aria-hidden
            className="absolute bottom-2 start-[27px] top-2 w-[2px] rounded-full bg-border md:bottom-auto md:start-0 md:top-7 md:h-[2px] md:w-full"
          />
          <span
            aria-hidden
            className="nus-vprogress absolute bottom-2 start-[27px] top-2 w-[2px] rounded-full bg-gradient-to-b from-gold via-gold-soft to-gold md:bottom-auto md:start-0 md:top-7 md:h-[2px] md:w-full md:bg-gradient-to-r md:from-gold md:via-gold-soft md:to-gold rtl:md:bg-gradient-to-l"
          />
          <ol className="relative space-y-10 md:grid md:grid-cols-7 md:gap-4 md:space-y-0">
            {ONBOARDING_STEPS.map((code, i) => {
              const meta = STEP_META[code];
              return (
                <li key={code} className="relative flex gap-4 md:flex-col md:items-center md:gap-0 md:text-center">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-gold/50 bg-card shadow-sm">
                    <span className="text-sm font-extrabold text-gold-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className={cn("flex-1 pt-1 md:pt-5", i % 2 === 1 && "md:translate-y-8")}>
                    <div className="flex items-center gap-2 md:flex-col md:items-center md:gap-1.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:bg-gold/10 md:text-gold-deep">
                        <Icon name={meta.icon} className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <h3 className="text-sm font-bold text-foreground">
                        {t(`nusHome.how.steps.${meta.key}.title`)}
                      </h3>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {t(`nusHome.how.steps.${meta.key}.desc`)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ================= S06 — MUHDIN NETWORK ================= */
function NetworkSection() {
  const { t } = useT();
  return (
    <section
      aria-label={t("nusHome.aria.network")}
      className="relative overflow-hidden bg-forest-deep py-16 sm:py-24"
    >
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          light
          eyebrow={t("nusHome.network.eyebrow")}
          title={t("nusHome.network.title")}
          subtitle={t("nusHome.network.sub")}
        />

        {/* Desktop ≥md: radial absolut — node pusat + 9 node + garis SVG "data mengalir" */}
        <div className="relative mx-auto mt-14 hidden h-[440px] w-full max-w-2xl md:block lg:h-[480px]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {NODE_POS.map(({ code, x, y }) => (
              <line
                key={code}
                x1="50"
                y1="50"
                x2={x}
                y2={y}
                className="nus-netline"
                stroke="oklch(0.72 0.135 85 / 0.55)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="nus-glow flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep shadow-2xl">
              <Icon name="hexagon" className="h-10 w-10 text-forest-deep" strokeWidth={1.8} />
            </div>
            <p className="mt-2 text-center text-xs font-extrabold tracking-[0.25em] text-gold">
              {t("nusHome.network.center")}
            </p>
          </div>

          {NODE_POS.map(({ code, x, y }, i) => (
            <div
              key={code}
              className="absolute w-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className="nus-float mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-white/5 text-gold-soft backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.45}s` }}
              >
                <Icon name={NODE_META[code]} className="h-6 w-6" strokeWidth={1.7} />
              </div>
              <p className="mt-1.5 text-center text-[10px] font-bold tracking-wider text-emerald-100/75">
                {t(`nusHome.network.nodes.${NODE_KEY[code]}`)}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile <md: MUHDIN di atas + grid 3x3 dengan garis konektor dekoratif */}
        <div className="mt-10 md:hidden">
          <div className="flex flex-col items-center">
            <div className="nus-glow flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft via-gold to-gold-deep shadow-xl">
              <Icon name="hexagon" className="h-9 w-9 text-forest-deep" strokeWidth={1.8} />
            </div>
            <p className="mt-2 text-xs font-extrabold tracking-[0.25em] text-gold">
              {t("nusHome.network.center")}
            </p>
            <span aria-hidden className="nus-connector mt-3 block h-8 w-[2px]" />
          </div>
          <div className="relative mt-3">
            <span
              aria-hidden
              className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/25 to-transparent"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/25 to-transparent"
            />
            <ul className="relative grid grid-cols-3 gap-3">
              {NETWORK_NODES.map((code) => (
                <li
                  key={code}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center backdrop-blur-sm"
                >
                  <Icon name={NODE_META[code]} className="h-5 w-5 text-gold-soft" strokeWidth={1.7} />
                  <span className="text-[10px] font-bold tracking-wide text-emerald-100/75">
                    {t(`nusHome.network.nodes.${NODE_KEY[code]}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= S07 — FOUNDING ECOSYSTEM 2026 ================= */
function FoundingSection() {
  const { t } = useT();
  return (
    <section aria-label={t("nusHome.aria.founding")} className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-gold/50 bg-gradient-to-br from-forest-deep via-forest-deep to-forest p-8 text-center shadow-[0_0_80px_-20px_oklch(0.72_0.135_85/0.45)] sm:p-14">
            <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" aria-hidden />
            <div className="relative">
              <Badge className="border border-gold/40 bg-gold/15 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-gold-soft sm:text-xs">
                {t("nusHome.founding.badge")}
              </Badge>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {t("nusHome.founding.title")}
              </h2>
              <div className="gold-divider mx-auto mt-6 w-40" aria-hidden />
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-emerald-100/85 sm:text-base">
                {t("nusHome.founding.message")}
              </p>
              <Button
                size="lg"
                onClick={() => navigate("daftar")}
                className="mt-8 h-12 bg-gold px-8 text-sm font-extrabold tracking-widest text-forest-deep hover:bg-gold-soft"
              >
                {t("nusHome.founding.cta")}
                <Icon name="arrow-right" className="ms-2 h-4 w-4 icon-flip" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= S08 — MEMBERSHIP ================= */
function MembershipSection() {
  const { t } = useT();
  return (
    <section aria-label={t("nusHome.aria.membership")} className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("nusHome.membership.eyebrow")}
          title={t("nusHome.membership.title")}
          subtitle={t("nusHome.membership.sub")}
        />
        <Stagger
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          stagger={0.07}
        >
          {MEMBERSHIP_TIERS.map((tier) => {
            const key = TIER_KEY[tier.code];
            const popular = tier.code === "PPIU_PIHK";
            return (
              <StaggerItem key={tier.code} className="h-full">
                <div
                  className={cn(
                    "relative flex h-full flex-col rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                    popular ? "border-gold shadow-[0_0_30px_-10px_oklch(0.72_0.135_85/0.5)] ring-2 ring-gold/60" : "hover:border-gold/40"
                  )}
                >
                  {popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap border-none bg-gold px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-forest-deep">
                      {t("nusHome.membership.popular")}
                    </Badge>
                  )}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={tier.icon} className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide text-foreground">
                    {t(`nusHome.membership.tiers.${key}`)}
                  </h3>
                  <p className="mt-2">
                    <span className="text-2xl font-extrabold tracking-tight text-foreground">
                      {tier.price === "By Agreement" ? t("nusHome.membership.byAgreement") : tier.price}
                    </span>
                    {tier.period && (
                      <span className="ms-1 text-xs text-muted-foreground">
                        {t("nusHome.membership.perYear")}
                      </span>
                    )}
                  </p>
                  <ul className="mt-4 space-y-2 border-t pt-4">
                    {["benefit1", "benefit2", "benefit3"].map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Icon name="check-circle-2" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep" />
                        {t(`nusHome.membership.${b}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Footer wajib (ROLE 25) — klarifikasi iuran keanggotaan */}
        <Reveal className="mt-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-2xl border bg-card p-5 text-start sm:flex-row sm:justify-between">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" />
              {t("nusHome.membership.footer")}
            </p>
            <Button
              onClick={() => navigate("daftar")}
              className="shrink-0 bg-primary font-bold text-primary-foreground hover:bg-primary/90"
            >
              {t("nusHome.membership.cta")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= S09 — ACADEMY ================= */
function AcademySection() {
  const { t } = useT();
  return (
    <section
      aria-label={t("nusHome.aria.academy")}
      className="bg-mint/30 py-16 sm:py-24 dark:bg-muted/30"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t("nusHome.academy.eyebrow")}
          title={t("nusHome.academy.title")}
          subtitle={t("nusHome.academy.sub")}
        />
        <Stagger className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-3" stagger={0.06}>
          {ACADEMY_TOPICS.map((code) => {
            const meta = TOPIC_META[code];
            return (
              <StaggerItem key={code}>
                <div className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold-deep transition-colors group-hover:bg-gold/20">
                    <Icon name={meta.icon} className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="text-xs font-bold leading-snug text-foreground sm:text-sm">
                    {t(`nusHome.academy.topics.${meta.key}`)}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <Reveal className="mt-9 text-center">
          <Button
            variant="outline"
            onClick={() => navigate("tutorial")}
            className="h-11 border-primary px-6 font-bold text-primary hover:bg-primary hover:text-primary-foreground"
          >
            {t("nusHome.academy.cta")}
            <Icon name="arrow-right" className="ms-2 h-4 w-4 icon-flip" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= S10 — PARTNERSHIP ================= */
function PartnershipSection() {
  const { t } = useT();
  return (
    <section
      aria-label={t("nusHome.aria.partnership")}
      className="relative overflow-hidden bg-forest-deep py-16 sm:py-24"
    >
      <div className="absolute inset-0 bg-islamic-pattern opacity-70" aria-hidden />
      <div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <SectionHeading
          light
          eyebrow={t("nusHome.partnership.eyebrow")}
          title={t("nusHome.partnership.title")}
          subtitle={t("nusHome.partnership.sub")}
        />
        <Reveal className="mt-9">
          <Button
            size="lg"
            onClick={() => navigate("daftar")}
            className="h-12 bg-gold px-8 text-sm font-extrabold tracking-widest text-forest-deep hover:bg-gold-soft"
          >
            {t("nusHome.partnership.cta")}
            <Icon name="handshake" className="ms-2 h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= NEWS STRIP (sebelum S11) ================= */
function NewsSection() {
  const { t, locale } = useT();
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    let alive = true;
    apiGet<Article[]>("/api/articles?limit=3")
      .then((data) => {
        if (alive) setArticles(data);
      })
      .catch(() => {
        if (alive) setArticles([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  /* Gagal / kosong → section hilang dengan anggun */
  if (articles !== null && articles.length === 0) return null;

  return (
    <section aria-label={t("nusHome.aria.news")} className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t("nusHome.news.eyebrow")} title={t("nusHome.news.title")} />
        {articles === null ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border bg-card">
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="space-y-2 p-5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Stagger className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.09}>
            {articles.map((a) => (
              <StaggerItem key={a.id} className="h-full">
                <button
                  onClick={() => navigate(`berita/${a.slug}`)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-card text-start shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={a.cover || "/images/hero-kaaba.jpg"}
                      alt={a.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute start-3 top-3 border-none bg-forest-deep/90 text-gold-soft">
                      {a.category}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon name="calendar" className="h-3.5 w-3.5" />
                      {formatDateL10n(a.createdAt, locale)}
                    </div>
                    <h3 className="mt-2 line-clamp-2 font-bold leading-snug transition-colors group-hover:text-primary">
                      {a.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-gold-deep">
                      {t("nusHome.news.readMore")}
                      <Icon name="arrow-right" className="h-3.5 w-3.5 icon-flip" />
                    </span>
                  </div>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}

/* ================= S11 — FINAL CTA ================= */
function FinalCtaSection() {
  const { t } = useT();
  const buttons = [
    { label: "b1", primary: true },
    { label: "b2", primary: false },
    { label: "b3", primary: false },
    { label: "b4", primary: false },
  ] as const;
  return (
    <section
      aria-label={t("nusHome.aria.final")}
      className="relative overflow-hidden bg-gradient-to-b from-forest-deep to-forest py-16 sm:py-24"
    >
      <div className="absolute inset-0 bg-islamic-pattern-gold opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t("nusHome.final.title")}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-3 text-sm text-emerald-100/80 sm:text-base">{t("nusHome.final.sub")}</p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3">
            {buttons.map(({ label, primary }) => (
              <Button
                key={label}
                size="lg"
                onClick={() => navigate("daftar")}
                className={cn(
                  "h-12 px-4 text-xs font-extrabold tracking-wider sm:text-sm",
                  primary
                    ? "bg-gold text-forest-deep hover:bg-gold-soft"
                    : "border-white/30 bg-white/5 text-white hover:border-gold/60 hover:bg-white/10 hover:text-gold"
                )}
              >
                {t(`nusHome.final.${label}`)}
              </Button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= HOME VIEW (dipakai muhdin-app.tsx) ================= */
export function HomeView() {
  return (
    <div>
      <HeroSection />
      <IdeaSection />
      <EcosystemSection />
      <VerifiedSection />
      <HowItWorksSection />
      <NetworkSection />
      <FoundingSection />
      <MembershipSection />
      <AcademySection />
      <PartnershipSection />
      <NewsSection />
      <FinalCtaSection />
    </div>
  );
}
