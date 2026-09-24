"use client";

import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useHashRoute, navigate, useScrollToTopOnRoute } from "@/hooks/use-hash-route";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { HomeView } from "@/components/views/home-view";
import { EcosystemView } from "@/components/views/ecosystem-view";
import { JourneyView } from "@/components/views/journey-view";
import { MembersView } from "@/components/views/members-view";
import { TutorialView } from "@/components/views/tutorial-view";
import { NewsView } from "@/components/views/news-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";
import { JoinView } from "@/components/views/join-view";
import { NusukView } from "@/components/views/nusuk-view";
import { TrackView } from "@/components/views/track-view";
import { GalleryView } from "@/components/views/gallery-view";
import { AgendaView } from "@/components/views/agenda-view";
import { DownloadsView } from "@/components/views/downloads-view";
import { ReportView } from "@/components/views/report-view";
import { AdminView } from "@/components/admin/admin-view";
import { LocaleProvider, useT } from "@/lib/i18n";
import { RegisterSW } from "@/components/pwa/register-sw";

function LoadingSplash() {
  const { t } = useT();
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">{t("misc.loading")}</p>
      </div>
    </div>
  );
}

/**
 * Task 21 — Scroll Progress: garis rambut emas di puncak viewport yang
 * mengikuti posisi gulir (sentuhan konsultan kelas dunia, ala McKinsey).
 * RTL-aware (dari kanan di bahasa Arab), tersembunyi di rute admin.
 */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 z-[70] h-[3px] origin-left rtl:origin-right bg-gradient-to-r from-gold via-gold-soft to-gold shadow-[0_0_12px_rgba(212,175,55,0.55)]"
    />
  );
}

function NotFound() {
  const { t } = useT();
  return (
    <div className="flex-1 grid place-items-center py-32 px-4">
      <div className="text-center space-y-4">
        <p className="text-7xl font-extrabold text-primary/20">{t("misc.notfound.code")}</p>
        <h1 className="text-2xl font-bold">{t("misc.notfound.title")}</h1>
        <p className="text-muted-foreground max-w-md">
          {t("misc.notfound.body")}
        </p>
        <button
          onClick={() => navigate("beranda")}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest transition-colors"
        >
          {t("misc.notfound.cta")}
        </button>
      </div>
    </div>
  );
}

export function MuhdinApp({ initialLocale = "id" }: { initialLocale?: "id" | "en" | "ar" }) {
  const route = useHashRoute();
  const root = route[0] || "beranda";
  const isAdmin = root === "admin";

  useScrollToTopOnRoute([root, route[1]]);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, "", "#/beranda");
    }
  }, []);

  let content: React.ReactNode;
  switch (root) {
    case "beranda":
      content = <HomeView />;
      break;
    case "ekosistem":
      // Task 30 — deep-link #/ekosistem/<nomor> membuka dialog detail langsung.
      content = <EcosystemView focusNumber={route[1]} />;
      break;
    case "alur":
      content = <JourneyView />;
      break;
    case "anggota":
      // Task 30 — deep-link #/anggota/verifikasi membuka tab Cek Verifikasi.
      // key-remount agar state tab mengikuti hash terbaru.
      content = <MembersView key={`anggota-${route[1] ?? ""}`} initialTab={route[1]} />;
      break;
    case "tutorial":
      content = <TutorialView slug={route[1]} />;
      break;
    case "berita":
      content = <NewsView slug={route[1]} />;
      break;
    case "tentang":
      content = <AboutView />;
      break;
    case "kontak":
      content = <ContactView />;
      break;
    case "gabung":
      content = <JoinView />;
      break;
    case "nusuk":
      content = <NusukView />;
      break;
    case "lacak":
      content = <TrackView />;
      break;
    case "galeri":
      content = <GalleryView />;
      break;
    case "agenda":
      content = <AgendaView />;
      break;
    case "unduhan":
      content = <DownloadsView />;
      break;
    case "lapor":
      content = <ReportView />;
      break;
    case "admin":
      content = <AdminView />;
      break;
    default:
      content = <NotFound />;
  }

  return (
    <LocaleProvider initialLocale={initialLocale}>
      <RegisterSW />
      {!isAdmin && <ScrollProgress />}
      {isAdmin ? (
        <div className="min-h-screen bg-muted/40 flex flex-col">
          <AdminView />
        </div>
      ) : (
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1 flex flex-col">{content}</main>
          <Footer />
        </div>
      )}
    </LocaleProvider>
  );
}

export default MuhdinApp;
