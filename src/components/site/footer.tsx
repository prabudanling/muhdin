"use client";

/**
 * Task 20 — "The Crown Footer" — footer paling megah dalam sejarah MUHDIN.
 *
 * Lapisan kemewahan (semua token Spectrum 8 + utilitas globals.css):
 *  1. Aurorae — hairline emas gold-divider di puncak + glow ambient blur.
 *  2. Kolom dengan heading berlian emas & link sweep-emas saat hover.
 *  3. Panel Mitra Teknologi: Developer PT Digital Bisnis Manajemen (Digiman)
 *     + Support System JuraganWeb (Task 20 — permintaan klien).
 *  4. Bar kepercayaan: PWA, 3 Bahasa, Ter-Audit, Terhubung Nusuk.
 *  5. Bawah: copyright + tagline shimmer emas.
 *
 * RTL aman penuh (start/end/me/ms) — newsletter & navigasi berfungsi seperti
 * sebelumnya; footer tetap tersembunyi di rute admin & menempel di dasar
 * viewport (mt-auto).
 */

import { useEffect, useState } from "react";
import { useHashRoute, navigate } from "@/hooks/use-hash-route";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiSend } from "@/lib/client-api";
import { MuhdinBrand } from "@/components/site/logo";
import { Icon } from "@/components/site/icon";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/lib/i18n";

const NAV_LINKS: [path: string, key: string][] = [
  ["beranda", "beranda"],
  ["nusuk", "nusukHub"],
  ["ekosistem", "ekosistem13"],
  ["alur", "alur"],
  ["anggota", "anggota"],
  // Task 30 — deep-link tab verifikasi: #/anggota/verifikasi kini membuka tab Cek Verifikasi langsung.
  ["anggota/verifikasi", "verifikasi"],
  ["tutorial", "tutorial"],
  ["berita", "berita"],
  ["gabung", "gabung"],
];

/** Task 18-c — tautan cepat ke 5 halaman portal baru. */
const QUICK_LINKS: [path: string, key: string][] = [
  ["lacak", "lacak"],
  ["galeri", "galeri"],
  ["agenda", "agenda"],
  ["unduhan", "unduhan"],
  ["lapor", "lapor"],
];

/** Task 30 — tiap layanan footer kini deep-link ke detail ekosistemnya (dialog auto-terbuka). */
const EKOSISTEM_LINKS: [key: string, num: number][] = [
  ["visa", 1],
  ["handling", 2],
  ["akomodasi", 6],
  ["raudah", 9],
  ["retail", 11],
  ["command", 13],
];

/** Task 30 — ikon sosmed memakai URL resmi dari Pengaturan Situs (CMS), bukan placeholder. */
const SOCIALS: [key: string, icon: string, settingKey: string][] = [
  ["instagram", "instagram", "instagram"],
  ["facebook", "facebook", "facebook"],
  ["twitter", "twitter", "twitter"],
  ["youtube", "youtube", "youtube"],
  ["whatsapp", "message-circle", "whatsapp"],
];

/** Normalisasi nomor WA menjadi format internasional untuk tautan wa.me. */
function waDigits(raw: string): string {
  let d = (raw || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = `62${d.slice(1)}`;
  else if (d.startsWith("8")) d = `62${d}`;
  return d;
}

/** Bar kepercayaan — fitur nyata hasil Task 14–18. */
const TRUST_BADGES: [icon: string, key: string][] = [
  ["badge-check", "trustPwa"],
  ["languages", "trustLang"],
  ["shield-check", "trustSecure"],
  ["satellite", "trustNusuk"],
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsMsg = { kind: "dup" | "error"; text: string };

/** Form "Berlangganan Kabar" → POST /api/subscribers {email}. Sukses: toast; gagal: inline. */
function NewsletterForm() {
  const { t } = useT();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<NewsMsg | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setMsg({ kind: "error", text: t("footer.newsErrInvalid") });
      return;
    }
    setLoading(true);
    try {
      // Kontrak: 201 {ok:true} / duplikat 201 {ok:true,already:true} / 409 — semuanya ramah.
      const res = await apiSend<{ ok?: boolean; already?: boolean }>("/api/subscribers", "POST", { email: value });
      if (res?.already) {
        setMsg({ kind: "dup", text: t("footer.newsDupMsg") });
      } else {
        toast({ title: t("footer.newsOkTitle"), description: t("footer.newsOkDesc") });
        setEmail("");
      }
    } catch (err) {
      const raw = ((err as Error).message || "").trim();
      if (/sudah|terdaftar|already|exist|409/i.test(raw)) {
        setMsg({ kind: "dup", text: t("footer.newsDupMsg") });
      } else {
        setMsg({ kind: "error", text: raw || t("footer.newsErrMsg") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex items-start gap-3 flex-1">
        <span className="shrink-0 h-10 w-10 rounded-xl grid place-items-center bg-gold/15 text-gold ring-1 ring-gold/30">
          <Icon name="bell" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-semibold text-white text-sm tracking-wide">{t("footer.newsTitle")}</h3>
          <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">{t("footer.newsDesc")}</p>
        </div>
      </div>
      <div className="w-full lg:max-w-md">
        <form onSubmit={submit} noValidate className="flex flex-col sm:flex-row gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            {t("footer.newsAria")}
          </label>
          <Input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("footer.newsPlaceholder")}
            aria-label={t("footer.newsAria")}
            aria-invalid={msg?.kind === "error"}
            autoComplete="email"
            dir="ltr"
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-emerald-100/40"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-gold text-forest-deep font-bold hover:bg-gold/90 shrink-0"
          >
            {loading ? (
              <Icon name="loader-2" className="h-4 w-4 me-1.5 animate-spin" />
            ) : (
              <Icon name="send" className="h-4 w-4 me-1.5" />
            )}
            {t("footer.newsBtn")}
          </Button>
        </form>
        {msg && (
          <p
            role="status"
            className={
              msg.kind === "dup"
                ? "mt-2 text-xs font-semibold text-emerald-100/80"
                : "mt-2 text-xs font-semibold text-gold"
            }
          >
            {msg.text}
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Elemen mewah Task 20 ---------- */

/** Heading kolom: belahan berlian emas + garis rambut gradien. */
function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.18em] text-white">
      <span
        aria-hidden
        className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.8)]"
      />
      <span>{children}</span>
      <span aria-hidden className="h-px w-6 bg-gradient-to-r from-gold/60 to-transparent" />
    </h3>
  );
}

/** Link footer: garis emas merambat masuk + underline sweep saat hover. */
function FootLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex max-w-full items-center text-start text-sm text-emerald-100/70 outline-none transition-colors hover:text-gold focus-visible:text-gold"
    >
      <span
        aria-hidden
        className="h-px w-0 shrink-0 bg-gold/80 transition-all duration-300 group-hover:w-3 group-hover:me-2"
      />
      <span className="relative break-words">
        {children}
        <span
          aria-hidden
          className="absolute -bottom-0.5 start-0 h-px w-0 bg-gold/50 transition-all duration-300 group-hover:w-full"
        />
      </span>
    </button>
  );
}

/** Item kredit mitra teknologi — ikon cincin emas + nama + tag. */
function Credit({
  icon,
  label,
  name,
  tag,
}: {
  icon: string;
  label: string;
  name: string;
  tag?: string;
}) {
  return (
    <div className="flex items-center gap-4 min-w-0">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold shadow-[0_8px_24px_-8px_rgba(212,175,55,0.45)]">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold/90">{label}</p>
        <p className="mt-0.5 text-base font-extrabold leading-tight text-white break-words sm:text-lg">
          {name}
          {tag && (
            <span className="ms-2 inline-block translate-y-[-1px] rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 align-middle text-[10px] font-bold text-gold">
              {tag}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

export function Footer() {
  const route = useHashRoute();
  const { t } = useT();
  const [settings, setSettings] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    let alive = true;
    apiGet<Record<string, string>>("/api/settings")
      .then((s) => alive && setSettings(s))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (route[0] === "admin") return null;

  const go = (path: string) => navigate(path);

  /** URL sosmed asli dari CMS; fallback ke halaman kontak bila belum diisi. */
  const socialHref = (settingKey: string): string => {
    const raw = settings?.[settingKey]?.trim();
    if (!raw) return "#/kontak";
    if (settingKey === "whatsapp") return `https://wa.me/${waDigits(raw)}`;
    return /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-forest-deep text-emerald-50/90">
      {/* 1 — Aurorae: hairline emas + glow ambient */}
      <div className="gold-divider relative z-10" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -start-[10%] h-72 w-72 rounded-full bg-gold/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -end-[8%] h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="bg-islamic-pattern-gold relative">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-14">
          {/* Newsletter — Task 18-c */}
          <div className="mb-12">
            <NewsletterForm />
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {/* Brand */}
            <div className="space-y-4">
              <div className="footer-brand-light">
                <MuhdinBrand light />
              </div>
              <p className="text-sm leading-relaxed text-emerald-100/70">{t("footer.desc")}</p>
              <p className="font-arabic text-2xl text-gold" dir="rtl">
                {BRAND.arabic}
              </p>
              <p className="text-gold-gradient inline-block text-sm font-extrabold tracking-wide">
                ✦ {t("footer.tagline")}
              </p>
              <div className="flex gap-2 pt-1">
                {SOCIALS.map(([key, icon, settingKey]) => {
                  const href = socialHref(settingKey);
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={key}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-100/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/15 hover:text-gold hover:shadow-[0_8px_20px_-6px_rgba(212,175,55,0.4)]"
                    >
                      <Icon name={icon} className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Tautan cepat — Task 18-c */}
            <nav aria-label={t("footer.colQuick")}>
              <ColHead>{t("footer.colQuick")}</ColHead>
              <ul className="space-y-2.5 text-sm">
                {QUICK_LINKS.map(([path, key]) => (
                  <li key={key}>
                    <FootLink onClick={() => go(path)}>{t(`footer.quick.${key}`)}</FootLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Navigasi */}
            <nav aria-label={t("footer.colNav")}>
              <ColHead>{t("footer.colNav")}</ColHead>
              <ul className="space-y-2.5 text-sm">
                {NAV_LINKS.map(([path, key], i) => (
                  <li key={`${path}-${i}`}>
                    <FootLink onClick={() => go(path)}>{t(`footer.nav.${key}`)}</FootLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Ekosistem */}
            <nav aria-label={t("footer.colEcosystem")}>
              <ColHead>{t("footer.colEcosystem")}</ColHead>
              <ul className="space-y-2.5 text-sm">
                {EKOSISTEM_LINKS.map(([k, num]) => (
                  <li key={k}>
                    <FootLink onClick={() => go(`ekosistem/${num}`)}>{t(`footer.eco.${k}`)}</FootLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Kontak */}
            <div>
              <ColHead>{t("footer.colContact")}</ColHead>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Icon name="mail" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <a
                    href={`mailto:${settings?.email?.trim() || "info@muhdin.web.id"}`}
                    className="text-emerald-100/70 break-all transition-colors hover:text-gold"
                  >
                    {settings?.email?.trim() || "info@muhdin.web.id"}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="phone" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <a
                    href={`tel:${(settings?.phone?.trim() || "+62 21 1234 5678").replace(/[^+\d]/g, "")}`}
                    className="text-emerald-100/70 transition-colors hover:text-gold"
                    dir="ltr"
                  >
                    {settings?.phone?.trim() || "+62 21 1234 5678"}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="map-pin" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70">{t("footer.addr")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="globe" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <a
                    href="https://www.muhdin.web.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-100/70 transition-colors hover:text-gold"
                    dir="ltr"
                  >
                    www.muhdin.web.id
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 2 — Panel Mitra Teknologi (Task 20): Digiman × JuraganWeb */}
          <div className="mt-14">
            <div className="mb-5 flex items-center gap-4" aria-hidden>
              <span className="gold-divider flex-1" />
              <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
                {t("footer.colTech")}
              </p>
              <span className="gold-divider flex-1" />
            </div>
            <div
              className="relative overflow-hidden rounded-3xl border border-gold/25 bg-white/[0.04] p-6 shadow-[0_24px_70px_-28px_rgba(0,0,0,0.65)] sm:p-8"
              aria-label={t("footer.colTech")}
            >
              <div
                aria-hidden
                className="animate-float-soft pointer-events-none absolute -top-24 -end-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-28 -start-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
              />
              <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                <Credit
                  icon="building-2"
                  label={t("footer.develLabel")}
                  name={t("footer.develName")}
                  tag={t("footer.develShort")}
                />
                <div
                  aria-hidden
                  className="hidden lg:block h-12 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent"
                />
                <Credit
                  icon="server"
                  label={t("footer.supportLabel")}
                  name={t("footer.supportName")}
                />
                <p className="hidden lg:ms-auto lg:block text-sm italic text-emerald-100/60">
                  <span className="text-gold-gradient font-extrabold not-italic">
                    {BRAND.name}
                  </span>{" "}
                  ✦ 2026
                </p>
              </div>
              {/* Baris kredit penuh (mobile & desktop) */}
              <p className="relative mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-center text-xs text-emerald-100/60">
                <Icon name="heart-handshake" className="h-4 w-4 shrink-0 text-gold" />
                {t("footer.crafted")}
              </p>
            </div>
          </div>

          {/* 3 — Bar kepercayaan */}
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {TRUST_BADGES.map(([icon, key]) => (
              <div
                key={key}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] font-semibold text-emerald-100/80 transition-colors hover:border-gold/30 hover:text-white sm:text-xs"
              >
                <Icon name={icon} className="h-4 w-4 shrink-0 text-gold" />
                <span className="truncate">{t(`footer.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 — Bar bawah */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-emerald-100/60 sm:flex-row">
            <p className="text-center sm:text-start">
              {t("footer.copyright", { year: new Date().getFullYear(), brand: BRAND.fullName })}
            </p>
            <p className="flex items-center gap-1.5">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-gold" />
              {t("footer.tagline")} — {t("footer.connecting")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
