"use client";

import { useHashRoute, navigate } from "@/hooks/use-hash-route";
import { MuhdinBrand } from "@/components/site/logo";
import { Icon } from "@/components/site/icon";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EKOSISTEM_LINKS = [
  "Visa Umroh & Haji",
  "Handling & Tour Leader",
  "Akomodasi & Transportasi",
  "Raudah & Ziarah",
  "Oleh-oleh & Retail",
  "Command Center 24/7",
];

export function Footer() {
  const route = useHashRoute();
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
              <p className="text-sm leading-relaxed text-emerald-100/70">
                Asosiasi di Atas Asosiasi Penyelenggara Ibadah — Operator Nusuk Indonesia.
                Mengawal perjalanan Tamu Allah dari Indonesia hingga Tanah Suci dengan standar
                mutu terintegrasi.
              </p>
              <p className="font-arabic text-xl text-gold" dir="rtl">
                {BRAND.arabic}
              </p>
            </div>

            {/* Navigasi */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">Navigasi</h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  ["beranda", "Beranda"],
                  ["ekosistem", "13 Ekosistem"],
                  ["alur", "Alur Perjalanan Jamaah"],
                  ["anggota", "Direktori Anggota"],
                  ["anggota", "Cek Verifikasi"],
                  ["tutorial", "Pusat Tutorial"],
                  ["berita", "Berita & Artikel"],
                  ["gabung", "Cara Bergabung"],
                ].map(([path, label], i) => (
                  <li key={`${path}-${i}`}>
                    <button
                      onClick={() => go(path)}
                      className="text-emerald-100/70 hover:text-gold transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ekosistem */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">Layanan Ekosistem</h3>
              <ul className="space-y-2.5 text-sm">
                {EKOSISTEM_LINKS.map((label) => (
                  <li key={label}>
                    <button
                      onClick={() => go("ekosistem")}
                      className="text-emerald-100/70 hover:text-gold transition-colors"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h3 className="font-semibold text-white mb-4 text-sm tracking-wide">Hubungi Kami</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <Icon name="mail" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70 break-all">info@muhdin.web.id</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="phone" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70">+62 21 1234 5678</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="map-pin" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70">Gedung Asosiasi MUHDIN, Jakarta Pusat, Indonesia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="globe" className="h-4 w-4 mt-0.5 text-gold shrink-0" />
                  <span className="text-emerald-100/70">www.muhdin.web.id</span>
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
            <p>
              © {new Date().getFullYear()} {BRAND.fullName} (MUHDIN). Seluruh hak cipta dilindungi.
            </p>
            <p className="flex items-center gap-1.5">
              <Icon name="sparkles" className="h-3.5 w-3.5 text-gold" />
              {BRAND.tagline} — {BRAND.connecting}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
