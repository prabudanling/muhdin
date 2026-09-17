"use client";

import { useHashRoute, navigate } from "@/hooks/use-hash-route";
import { MuhdinBrand } from "@/components/site/logo";
import { Icon } from "@/components/site/icon";
import { BRAND } from "@/lib/constants";
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

const EKOSISTEM_KEYS = ["visa", "handling", "akomodasi", "raudah", "retail", "command"] as const;

export function Footer() {
  const route = useHashRoute();
  const { t } = useT();
  if (route[0] === "admin") return null;

  const go = (path: string) => navigate(path);

  return (
    <footer className="mt-auto bg-forest-deep text-emerald-50/90">
      <div className="bg-islamic-pattern-gold">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
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
