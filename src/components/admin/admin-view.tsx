"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { MuhdinBrand, MuhdinLogo } from "@/components/site/logo";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import {
  AdminArticles, AdminEcosystems, AdminJourney, AdminRoadmap, AdminMembers,
  AdminTutorials, AdminFaqs, AdminTestimonials, AdminManagement,
  AdminMessages, AdminApplications, AdminSettings,
} from "@/components/admin/admin-sections";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { id: "articles", label: "Berita & Artikel", icon: "newspaper" },
  { id: "ecosystems", label: "13 Ekosistem", icon: "boxes" },
  { id: "journey", label: "Alur Perjalanan", icon: "workflow" },
  { id: "roadmap", label: "Roadmap 2026-2030", icon: "target" },
  { id: "members", label: "Direktori Anggota", icon: "grid-3x3" },
  { id: "applications", label: "Pendaftaran", icon: "user-plus" },
  { id: "tutorials", label: "Tutorial", icon: "graduation-cap" },
  { id: "messages", label: "Pesan Masuk", icon: "inbox" },
  { id: "faqs", label: "FAQ", icon: "help-circle" },
  { id: "testimonials", label: "Testimoni", icon: "quote" },
  { id: "management", label: "Struktur Organisasi", icon: "users" },
  { id: "settings", label: "Pengaturan Situs", icon: "settings" },
];

export function AdminView() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const check = useCallback(() => {
    apiGet<{ user: User | null }>("/api/auth/me")
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const logout = async () => {
    try {
      await apiSend("/api/auth/logout", "POST");
      setUser(null);
      toast({ title: "Berhasil keluar", description: "Sampai jumpa kembali!" });
    } catch {
      toast({ title: "Gagal keluar", variant: "destructive" });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginForm onSuccess={check} />;

  const current = MENU.find((m) => m.id === section);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b">
        <MuhdinBrand compact />
        <p className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-wider font-semibold">
          CMS Admin Panel
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-0.5" aria-label="Menu admin">
        {MENU.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSection(m.id);
              setSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
              section === m.id
                ? "bg-gradient-to-r from-primary to-forest text-white shadow-md"
                : "text-foreground/70 hover:bg-primary/10 hover:text-primary"
            )}
          >
            <Icon name={m.icon} className="h-4 w-4 shrink-0" />
            {m.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t space-y-2">
        <div className="flex items-center gap-2.5 px-1">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-forest grid place-items-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <Icon name="logout" className="h-4 w-4 mr-2" /> Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 shrink-0 border-r bg-sidebar sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Menu Admin</SheetTitle>
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 glass border-b">
          <div className="flex items-center gap-3 px-4 sm:px-6 h-16">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Buka menu admin">
              <Icon name="menu" className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon name={current?.icon || "layout-dashboard"} className="h-5 w-5 text-primary shrink-0" />
              <h1 className="font-extrabold text-lg truncate">{current?.label || "Dashboard"}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("beranda")} className="hidden sm:inline-flex text-primary">
                <Icon name="external-link" className="h-4 w-4 mr-1.5" />
                Lihat Situs
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {section === "dashboard" && <AdminDashboard onNavigate={setSection} />}
          {section === "articles" && <AdminArticles />}
          {section === "ecosystems" && <AdminEcosystems />}
          {section === "journey" && <AdminJourney />}
          {section === "roadmap" && <AdminRoadmap />}
          {section === "members" && <AdminMembers />}
          {section === "applications" && <AdminApplications />}
          {section === "tutorials" && <AdminTutorials />}
          {section === "messages" && <AdminMessages />}
          {section === "faqs" && <AdminFaqs />}
          {section === "testimonials" && <AdminTestimonials />}
          {section === "management" && <AdminManagement />}
          {section === "settings" && <AdminSettings />}
        </main>

        <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground pb-[max(1rem,env(safe-area-inset-bottom))]">
          MUHDIN CMS v1.0 — Bersama Melayani Tamu Allah
        </footer>
      </div>
    </div>
  );
}

/* ================= LOGIN ================= */
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiSend<{ user: User }>("/api/auth/login", "POST", { email, password });
      toast({ title: `Selamat datang, ${res.user.name}!`, description: "Anda berhasil masuk ke CMS MUHDIN." });
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand side */}
      <div className="hidden lg:flex flex-col justify-between bg-forest-deep text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
        <div className="relative">
          <MuhdinBrand light />
        </div>
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-tight">
            Portal Admin<br />
            <span className="text-gold-gradient">MUHDIN</span>
          </h2>
          <p className="mt-4 text-emerald-50/80 max-w-md">
            Kelola konten, anggota, tutorial, dan komunikasi ekosistem — semuanya dari
            satu dasbor terpadu.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            {[
              { icon: "newspaper", label: "Konten" },
              { icon: "users", label: "Keanggotaan" },
              { icon: "graduation-cap", label: "Tutorial" },
            ].map((f) => (
              <div key={f.label} className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <Icon name={f.icon} className="h-5 w-5 mx-auto text-gold" />
                <p className="mt-2 text-xs font-semibold">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-emerald-100/50">© {new Date().getFullYear()} MUHDIN — Bersama Melayani Tamu Allah</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <MuhdinLogo className="h-16 w-16" />
          </div>
          <h1 className="text-2xl font-extrabold">Masuk ke CMS</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Gunakan kredensial administrator MUHDIN.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@muhdin.web.id"
                  className="pl-9 h-11"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Icon name="keyround" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 h-11"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive flex items-center gap-1.5 bg-destructive/10 rounded-lg px-3 py-2">
                <Icon name="alert-triangle" className="h-4 w-4 shrink-0" />
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base bg-gradient-to-r from-primary to-forest text-white shadow-lg"
            >
              {loading ? <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="login" className="h-4 w-4 mr-2" />}
              Masuk ke Dashboard
            </Button>
          </form>

          <div className="mt-6 rounded-xl bg-gold/10 border border-gold/25 p-4 text-xs text-foreground/75">
            <p className="font-bold text-gold-deep flex items-center gap-1.5">
              <Icon name="info" className="h-3.5 w-3.5" />
              Kredensial Demo
            </p>
            <p className="mt-1.5 font-mono">
              Email: <b>admin@muhdin.web.id</b> · Password: <b>muhdin2026</b>
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Segera ganti password setelah implementasi produksi.
            </p>
          </div>

          <button
            onClick={() => navigate("beranda")}
            className="mt-6 text-sm text-primary font-medium hover:underline"
          >
            ← Kembali ke situs utama
          </button>
        </div>
      </div>
    </div>
  );
}
