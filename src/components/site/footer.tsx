"use client";

import { useState } from "react";
import { useHashRoute, navigate } from "@/hooks/use-hash-route";
import { useToast } from "@/hooks/use-toast";
import { apiSend } from "@/lib/client-api";
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
  ["anggota", "verifikasi"],
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

const EKOSISTEM_KEYS = ["visa", "handling", "akomodasi", "raudah", "retail", "command"] as const;

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
    <div className="rounded-2xl bg-white/5 border border-white/10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex items-start gap-3 flex-1">
        <span className="shrink-0 h-10 w-10 rounded-xl bg-gold/15 grid place-items-center text-gold">
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

export function Footer() {
  const route = useHashRoute();
  const { t } = useT();
  if (route[0] === "admin") return null;

  const go = (path: string) => navigate(path);

  return (
    <footer className="mt-auto bg-forest-deep text-emerald-50/90">
      <div className="bg-islamic-pattern-gold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          {/* Newsletter — Task 18-c */}
          <div className="mb-10">
            <NewsletterForm />
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {/* Brand */}
            <div className="space-y-4">
              <div className="[&_div.text-\[10px\]]:text-emerald-100/70">
                <MuhdinBrand light />
              </div>
              <p className="text-sm leading-relaxed text-emerald-100/70">{t("footer.desc")}</p>
              <p className="font-arabic text-xl text-gold" dir="rtl">
                {BRAND.arabic}
              </p>
            </div>

            {/* Tautan cepat — Task 18-c */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">{t("footer.colQuick")}</h3>
              <ul className="space-y-2.5 text-sm">
                {QUICK_LINKS.map(([path, key]) => (
                  <li key={key}>
                    <button
                      onClick={() => go(path)}
                      className="text-emerald-100/70 hover:text-gold transition-colors"
                    >
                      {t(`footer.quick.${key}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Navigasi */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">{t("footer.colNav")}</h3>
              <ul className="space-y-2.5 text-sm">
                {NAV_LINKS.map(([path, key], i) => (
                  <li key={`${path}-${i}`}>
                    <button
                      onClick={() => go(path)}
                      className="text-emerald-100/70 hover:text-gold transition-colors"
                    >
                      {t(`footer.nav.${key}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ekosistem */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">{t("footer.colEcosystem")}</h3>
              <ul className="space-y-2.5 text-sm">
                {EKOSISTEM_KEYS.map((k) => (
                  <li key={k}>
                    <button
                      onClick={() => go("ekosistem")}
                      className="text-emerald-100/70 hover:text-gold transition-colors"
                    >
                      {t(`footer.eco.${k}`)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">{t("footer.colContact")}</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Icon name="mail" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70 break-all">info@muhdin.web.id</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="phone" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70" dir="ltr">+62 21 1234 5678</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="map-pin" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70">{t("footer.addr")}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="globe" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70" dir="ltr">www.muhdin.web.id</span>
                </li>
              </ul>
              <div className="flex gap-2 mt-4">
                {["instagram", "facebook", "twitter", "youtube"].map((s) => (
                  <a
                    key={s}
                    href="#/kontak"
                    aria-label={s}
                    className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-gold/20 hover:text-gold transition-colors"
                  >
                    <Icon name={s} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-100/60">
            <p>{t("footer.copyright", { year: new Date().getFullYear(), brand: BRAND.fullName })}</p>
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
