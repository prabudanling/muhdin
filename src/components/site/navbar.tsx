"use client";

import { useEffect, useState } from "react";
import { useHashRoute, navigate } from "@/hooks/use-hash-route";
import { MuhdinBrand } from "@/components/site/logo";
import { Icon } from "@/components/site/icon";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { path: "beranda" },
  { path: "nusuk" },
  { path: "ekosistem" },
  { path: "anggota" },
  { path: "tutorial" },
  { path: "berita" },
  { path: "tentang" },
  { path: "kontak" },
] as const;

export function Navbar() {
  const route = useHashRoute();
  const { t } = useT();
  const current = route[0] || "beranda";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled ? "glass border-border/60 shadow-sm" : "bg-transparent border-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <button onClick={() => go("beranda")} className="focus:outline-none" aria-label={t("navbar.aria.brand")}>
            <MuhdinBrand />
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label={t("navbar.aria.nav")}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => go(item.path)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  current === item.path
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                )}
              >
                {t(`navbar.items.${item.path}`)}
              </button>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <LocaleSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => go("admin")}
              className="text-foreground/60 hover:text-primary"
            >
              <Icon name="login" className="h-4 w-4 me-1.5" />
              {t("navbar.portalMitra")}
            </Button>
            <Button
              size="sm"
              onClick={() => go("gabung")}
              className="bg-gradient-to-r from-primary to-forest text-white shadow-md hover:shadow-lg hover:from-forest hover:to-primary"
            >
              {t("navbar.gabung")}
              <Icon name="arrow-right" className="h-4 w-4 ms-1.5 icon-flip" />
            </Button>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label={t("navbar.aria.menu")}>
                <Icon name="menu" className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-5 border-b">
                  <SheetTitle asChild>
                    <div>
                      <MuhdinBrand />
                    </div>
                  </SheetTitle>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin" aria-label={t("navbar.aria.navMobile")}>
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => go(item.path)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        current === item.path
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/75 hover:bg-muted"
                      )}
                    >
                      {t(`navbar.items.${item.path}`)}
                      <Icon name="chevron-right" className="h-4 w-4 opacity-50 icon-flip" />
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t space-y-2">
                  <LocaleSwitcher variant="mobile" />
                  <Button className="w-full" onClick={() => go("gabung")}>
                    {t("navbar.gabung")}
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => go("admin")}>
                    <Icon name="login" className="h-4 w-4 me-2" />
                    {t("navbar.mobilePortal")}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
