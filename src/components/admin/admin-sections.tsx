"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, apiSend, formatDateTime } from "@/lib/client-api";
import { Icon } from "@/components/site/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CrudManager, AdminBadge } from "@/components/admin/crud-manager";
import type {
  ColumnDef, FieldDef,
} from "@/components/admin/crud-manager";
import type {
  Article, Ecosystem, JourneyStep, Roadmap, Member, Tutorial, Faq, Testimonial,
  ManagementMember, ContactMessage, MembershipApplication, SiteSettings,
} from "@/lib/types";

// ====== SHARED OPTIONS ======
const CLUSTER_OPTS = ["Akses & Mobilitas", "Pengalaman Ibadah", "Nilai Tambah & Jaminan Mutu"].map((c) => ({ value: c, label: c }));
const TYPE_OPTS = [
  { value: "PPIU", label: "PPIU" },
  { value: "PIHK", label: "PIHK" },
  { value: "KBIHU", label: "KBIHU" },
  { value: "IPHI", label: "IPHI" },
  { value: "TRAVEL_WISATA", label: "Travel Wisata" },
];
const ICON_OPTS = [
  "passport", "plane-takeoff", "users", "plane-landing", "book-open", "building-2",
  "bus", "map", "landmark", "utensils", "shopping-bag", "clipboard-list", "shield-check",
  "moon-star", "award", "heart-handshake", "graduation-cap", "wallet", "smartphone",
  "map-pin", "brain-circuit", "git-merge", "layout-dashboard", "languages",
].map((i) => ({ value: i, label: i }));

const CATEGORY_OPTS = ["Berita", "Pengumuman", "Artikel", "Press Release"].map((c) => ({ value: c, label: c }));
const TUT_CAT_OPTS = ["Umum", "CMS", "Jamaah", "Mitra"].map((c) => ({ value: c, label: c }));
const LEVEL_OPTS = ["Pemula", "Menengah", "Mahir"].map((c) => ({ value: c, label: c }));
const FAQ_CAT_OPTS = ["Umum", "Keanggotaan", "Jamaah", "Teknologi"].map((c) => ({ value: c, label: c }));

/* ================= BERITA ================= */
export function AdminArticles() {
  const config = {
    title: "Berita & Artikel",
    description: "Kelola konten berita, pengumuman, artikel, dan press release portal MUHDIN.",
    endpoint: "/api/articles",
    itemName: "Artikel",
    searchKeys: ["title", "category", "author"],
    extraQuery: "?status=all",
    defaultItem: () => ({
      title: "", category: "Berita", author: "Tim MUHDIN", excerpt: "",
      content: "", cover: "/images/hero-kaaba.jpg", status: "PUBLISHED", featured: false,
    }),
    fields: [
      { key: "title", label: "Judul", type: "text", required: true, full: true } as FieldDef,
      { key: "category", label: "Kategori", type: "select", options: CATEGORY_OPTS, required: true },
      { key: "author", label: "Penulis", type: "text" },
      { key: "cover", label: "URL Gambar Sampul", type: "text", full: true, hint: "Contoh: /images/hero-kaaba.jpg" },
      { key: "excerpt", label: "Ringkasan (Excerpt)", type: "textarea", placeholder: "1-2 kalimat yang muncul di kartu berita…" },
      { key: "status", label: "Status", type: "select", options: [{ value: "PUBLISHED", label: "Terbit" }, { value: "DRAFT", label: "Draft" }], required: true },
      { key: "featured", label: "Jadikan Utama", type: "switch", hint: "Artikel utama tampil besar di halaman berita", full: true },
      { key: "content", label: "Konten (Markdown)", type: "markdown", placeholder: "## Sub-judul\n\nTulis konten di sini…" },
    ] as FieldDef[],
    columns: [
      { key: "title", label: "Judul", render: (a: Article) => (
        <div className="max-w-xs">
          <p className="font-semibold truncate">{a.title}</p>
          <p className="text-xs text-muted-foreground">{a.author}</p>
        </div>
      ) },
      { key: "category", label: "Kategori", hideOnMobile: true, render: (a: Article) => <Badge variant="secondary" className="text-[10px]">{a.category}</Badge> },
      { key: "status", label: "Status", render: (a: Article) => <AdminBadge status={a.status} /> },
      { key: "featured", label: "Utama", hideOnMobile: true, render: (a: Article) => a.featured ? <Icon name="star" className="h-4 w-4 fill-gold text-gold" /> : <span className="text-muted-foreground">—</span> },
      { key: "views", label: "Dilihat", hideOnMobile: true, render: (a: Article) => <span className="text-muted-foreground">{a.views}×</span> },
    ] as ColumnDef<Article>[],
  };
  return <CrudManager<Article> config={config} />;
}

/* ================= EKOSISTEM ================= */
export function AdminEcosystems() {
  const config = {
    title: "13 Ekosistem MUHDIN",
    description: "Kelola arsitektur 13 ekosistem layanan — ruang lingkup, standar, dan ikon.",
    endpoint: "/api/ecosystems",
    itemName: "Ekosistem",
    searchKeys: ["name", "cluster", "scope"],
    defaultItem: () => ({ number: 1, name: "", cluster: "Akses & Mobilitas", icon: "hexagon", scope: "", standard: "", description: "" }),
    fields: [
      { key: "number", label: "Nomor Urut (1-13)", type: "number", required: true },
      { key: "name", label: "Nama Ekosistem", type: "text", required: true },
      { key: "cluster", label: "Klaster", type: "select", options: CLUSTER_OPTS, required: true },
      { key: "icon", label: "Ikon", type: "select", options: ICON_OPTS },
      { key: "scope", label: "Ruang Lingkup", type: "textarea" },
      { key: "standard", label: "Standar MUHDIN", type: "textarea" },
      { key: "description", label: "Deskripsi Lengkap", type: "textarea", placeholder: "Penjelasan 2-3 kalimat tentang ekosistem ini…" },
    ] as FieldDef[],
    columns: [
      { key: "number", label: "No", render: (e: Ecosystem) => <span className="font-extrabold text-primary">{String(e.number).padStart(2, "0")}</span> },
      { key: "name", label: "Nama", render: (e: Ecosystem) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center text-primary shrink-0">
            <Icon name={e.icon} className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold">{e.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{e.scope}</p>
          </div>
        </div>
      ) },
      { key: "cluster", label: "Klaster", hideOnMobile: true, render: (e: Ecosystem) => <Badge variant="secondary" className="text-[10px]">{e.cluster}</Badge> },
    ] as ColumnDef<Ecosystem>[],
  };
  return <CrudManager<Ecosystem> config={config} />;
}

/* ================= ALUR ================= */
export function AdminJourney() {
  const config = {
    title: "Alur Perjalanan Jamaah (13 Tahap)",
    description: "Kelola tahapan end-to-end journey beserta aktor dan output digitalnya.",
    endpoint: "/api/journey",
    itemName: "Tahap",
    searchKeys: ["title", "actor", "activity"],
    defaultItem: () => ({ step: 1, title: "", activity: "", actor: "", output: "", icon: "circle" }),
    fields: [
      { key: "step", label: "Nomor Tahap", type: "number", required: true },
      { key: "title", label: "Judul Tahap", type: "text", required: true },
      { key: "icon", label: "Ikon", type: "select", options: ICON_OPTS },
      { key: "actor", label: "Aktor Utama", type: "text" },
      { key: "activity", label: "Aktivitas Utama", type: "textarea" },
      { key: "output", label: "Output Digital", type: "textarea" },
    ] as FieldDef[],
    columns: [
      { key: "step", label: "Tahap", render: (s: JourneyStep) => <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-white font-extrabold text-xs">{s.step}</span> },
      { key: "title", label: "Judul", render: (s: JourneyStep) => (
        <div>
          <p className="font-semibold">{s.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{s.activity}</p>
        </div>
      ) },
      { key: "actor", label: "Aktor", hideOnMobile: true, render: (s: JourneyStep) => <span className="text-muted-foreground text-xs">{s.actor}</span> },
    ] as ColumnDef<JourneyStep>[],
  };
  return <CrudManager<JourneyStep> config={config} />;
}

/* ================= ROADMAP ================= */
export function AdminRoadmap() {
  const config = {
    title: "Roadmap 2026-2030",
    description: "Kelola peta jalan implementasi empat fase transformasi digital.",
    endpoint: "/api/roadmap",
    itemName: "Fase",
    searchKeys: ["phase", "period", "focus"],
    defaultItem: () => ({ phase: "", period: "", focus: "", deliverables: "", order: 99 }),
    fields: [
      { key: "phase", label: "Nama Fase", type: "text", required: true, placeholder: "Contoh: Fase 1: Fondasi" },
      { key: "period", label: "Periode", type: "text", required: true, placeholder: "Contoh: 2026" },
      { key: "order", label: "Urutan", type: "number" },
      { key: "focus", label: "Fokus Utama", type: "text", full: true },
      { key: "deliverables", label: "Deliverables Kunci", type: "textarea" },
    ] as FieldDef[],
    columns: [
      { key: "phase", label: "Fase", render: (r: Roadmap) => (
        <div>
          <p className="font-semibold">{r.phase}</p>
          <p className="text-xs text-muted-foreground">{r.period}</p>
        </div>
      ) },
      { key: "focus", label: "Fokus", hideOnMobile: true, render: (r: Roadmap) => <span className="text-xs text-muted-foreground line-clamp-2 max-w-sm">{r.focus}</span> },
      { key: "order", label: "Urutan", hideOnMobile: true },
    ] as ColumnDef<Roadmap>[],
  };
  return <CrudManager<Roadmap> config={config} />;
}

/* ================= ANGGOTA ================= */
export function AdminMembers() {
  const config = {
    title: "Direktori Anggota",
    description: "Kelola data anggota terverifikasi yang tampil di direktori publik.",
    endpoint: "/api/members",
    itemName: "Anggota",
    searchKeys: ["name", "city", "licenseNo", "province"],
    extraQuery: "?status=all",
    defaultItem: () => ({
      name: "", type: "PPIU", city: "", province: "", licenseNo: "", phone: "",
      email: "", website: "", description: "", rating: 4.5, status: "TERVERIFIKASI",
      memberSince: new Date().getFullYear(),
    }),
    fields: [
      { key: "name", label: "Nama Organisasi", type: "text", required: true },
      { key: "type", label: "Jenis Mitra", type: "select", options: TYPE_OPTS, required: true },
      { key: "licenseNo", label: "Nomor Izin", type: "text", required: true },
      { key: "city", label: "Kota", type: "text", required: true },
      { key: "province", label: "Provinsi", type: "text" },
      { key: "phone", label: "Telepon", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "website", label: "Website", type: "text" },
      { key: "memberSince", label: "Anggota Sejak (Tahun)", type: "number" },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "status", label: "Status", type: "select", options: [
        { value: "TERVERIFIKASI", label: "Terverifikasi" },
        { value: "PENDING", label: "Menunggu" },
        { value: "SUSPENDED", label: "Ditangguhkan" },
      ], required: true },
      { key: "description", label: "Deskripsi Singkat", type: "textarea" },
    ] as FieldDef[],
    columns: [
      { key: "name", label: "Organisasi", render: (m: Member) => (
        <div>
          <p className="font-semibold">{m.name}</p>
          <p className="text-xs text-muted-foreground">{m.type} · {m.city}, {m.province}</p>
        </div>
      ) },
      { key: "licenseNo", label: "Nomor Izin", hideOnMobile: true, render: (m: Member) => <span className="font-mono text-xs">{m.licenseNo}</span> },
      { key: "status", label: "Status", render: (m: Member) => <AdminBadge status={m.status} /> },
      { key: "rating", label: "Rating", hideOnMobile: true, render: (m: Member) => (
        <span className="flex items-center gap-1 text-sm">
          <Icon name="star" className="h-3.5 w-3.5 fill-gold text-gold" /> {m.rating.toFixed(1)}
        </span>
      ) },
    ] as ColumnDef<Member>[],
  };
  return <CrudManager<Member> config={config} />;
}

/* ================= TUTORIAL ================= */
export function AdminTutorials() {
  const config = {
    title: "Pusat Tutorial",
    description: "Kelola panduan penggunaan portal & CMS untuk jamaah, mitra, dan admin.",
    endpoint: "/api/tutorials",
    itemName: "Tutorial",
    searchKeys: ["title", "category", "level"],
    extraQuery: "?all=1",
    defaultItem: () => ({
      title: "", category: "Umum", level: "Pemula", duration: 10,
      order: 99, published: true, summary: "", content: "",
    }),
    fields: [
      { key: "title", label: "Judul Tutorial", type: "text", required: true, full: true },
      { key: "category", label: "Kategori", type: "select", options: TUT_CAT_OPTS, required: true },
      { key: "level", label: "Level", type: "select", options: LEVEL_OPTS, required: true },
      { key: "duration", label: "Durasi (menit)", type: "number" },
      { key: "order", label: "Urutan Tampil", type: "number" },
      { key: "published", label: "Publikasikan", type: "switch", full: true, hint: "Tutorial yang tidak dipublikasikan hanya terlihat di CMS" },
      { key: "summary", label: "Ringkasan", type: "textarea" },
      { key: "content", label: "Konten (Markdown)", type: "markdown", placeholder: "## Langkah 1\n\n1. Lakukan…\n2. Klik…" },
    ] as FieldDef[],
    columns: [
      { key: "title", label: "Judul", render: (t: Tutorial) => (
        <div className="max-w-sm">
          <p className="font-semibold">{t.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{t.summary}</p>
        </div>
      ) },
      { key: "category", label: "Kategori", hideOnMobile: true, render: (t: Tutorial) => <Badge variant="secondary" className="text-[10px]">{t.category} · {t.level}</Badge> },
      { key: "published", label: "Status", render: (t: Tutorial) => (
        <Badge variant="outline" className={`text-[10px] font-bold ${t.published ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground"}`}>
          {t.published ? "Terbit" : "Draft"}
        </Badge>
      ) },
      { key: "views", label: "Dilihat", hideOnMobile: true, render: (t: Tutorial) => <span className="text-muted-foreground">{t.views}×</span> },
    ] as ColumnDef<Tutorial>[],
  };
  return <CrudManager<Tutorial> config={config} />;
}

/* ================= FAQ ================= */
export function AdminFaqs() {
  const config = {
    title: "Tanya Jawab (FAQ)",
    description: "Kelola pertanyaan yang sering diajukan pada halaman kontak.",
    endpoint: "/api/faqs",
    itemName: "FAQ",
    searchKeys: ["question", "category"],
    defaultItem: () => ({ question: "", answer: "", category: "Umum", order: 99 }),
    fields: [
      { key: "question", label: "Pertanyaan", type: "text", required: true, full: true },
      { key: "category", label: "Kategori", type: "select", options: FAQ_CAT_OPTS, required: true },
      { key: "order", label: "Urutan", type: "number" },
      { key: "answer", label: "Jawaban", type: "textarea", required: true },
    ] as FieldDef[],
    columns: [
      { key: "question", label: "Pertanyaan", render: (f: Faq) => <p className="font-semibold max-w-md truncate">{f.question}</p> },
      { key: "category", label: "Kategori", hideOnMobile: true, render: (f: Faq) => <Badge variant="secondary" className="text-[10px]">{f.category}</Badge> },
      { key: "order", label: "Urutan", hideOnMobile: true },
    ] as ColumnDef<Faq>[],
  };
  return <CrudManager<Faq> config={config} />;
}

/* ================= TESTIMONI ================= */
export function AdminTestimonials() {
  const config = {
    title: "Testimoni",
    description: "Moderasi testimoni — testimoni publik baru tampil setelah diaktifkan.",
    endpoint: "/api/testimonials",
    itemName: "Testimoni",
    searchKeys: ["name", "role", "content"],
    extraQuery: "?all=1",
    defaultItem: () => ({ name: "", role: "Jamaah", rating: 5, published: true, content: "" }),
    fields: [
      { key: "name", label: "Nama", type: "text", required: true },
      { key: "role", label: "Peran", type: "text", required: true, placeholder: "Jamaah / Pemilik PPIU / Tour Leader…" },
      { key: "rating", label: "Rating (1-5)", type: "number" },
      { key: "published", label: "Tampilkan Publik", type: "switch", full: true },
      { key: "content", label: "Isi Testimoni", type: "textarea", required: true },
    ] as FieldDef[],
    columns: [
      { key: "name", label: "Nama", render: (t: Testimonial) => (
        <div className="max-w-sm">
          <p className="font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.role}</p>
        </div>
      ) },
      { key: "rating", label: "Rating", hideOnMobile: true, render: (t: Testimonial) => (
        <span className="flex items-center gap-1 text-sm">
          <Icon name="star" className="h-3.5 w-3.5 fill-gold text-gold" /> {t.rating}
        </span>
      ) },
      { key: "published", label: "Publik", render: (t: Testimonial) => (
        <Badge variant="outline" className={`text-[10px] font-bold ${t.published ? "bg-primary/10 text-primary border-primary/30" : "bg-muted text-muted-foreground"}`}>
          {t.published ? "Tampil" : "Menunggu Moderasi"}
        </Badge>
      ) },
    ] as ColumnDef<Testimonial>[],
  };
  return <CrudManager<Testimonial> config={config} />;
}

/* ================= STRUKTUR ================= */
export function AdminManagement() {
  const config = {
    title: "Struktur Organisasi",
    description: "Kelola pengurus yang tampil pada halaman Tentang.",
    endpoint: "/api/management",
    itemName: "Pengurus",
    searchKeys: ["name", "position"],
    defaultItem: () => ({ name: "", position: "", bio: "", order: 99 }),
    fields: [
      { key: "name", label: "Nama Lengkap", type: "text", required: true },
      { key: "position", label: "Jabatan", type: "text", required: true },
      { key: "order", label: "Urutan", type: "number" },
      { key: "bio", label: "Bio Singkat", type: "textarea" },
    ] as FieldDef[],
    columns: [
      { key: "name", label: "Nama", render: (m: ManagementMember) => <p className="font-semibold">{m.name}</p> },
      { key: "position", label: "Jabatan", render: (m: ManagementMember) => <span className="text-xs text-muted-foreground">{m.position}</span> },
      { key: "order", label: "Urutan", hideOnMobile: true },
    ] as ColumnDef<ManagementMember>[],
  };
  return <CrudManager<ManagementMember> config={config} />;
}

/* ================= PESAN (custom) ================= */
export function AdminMessages() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [reading, setReading] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);

  const load = useCallback(() => {
    apiGet<ContactMessage[]>("/api/messages").then(setMessages).catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiSend(`/api/messages/${id}`, "PUT", { status });
      toast({ title: status === "REPLIED" ? "Ditandai sudah dibalas ✓" : "Ditandai sudah dibaca ✓" });
      if (reading) setReading({ ...reading, status });
      load();
    } catch (e) {
      toast({ title: "Gagal", description: (e as Error).message, variant: "destructive" });
    }
  };

  const doDelete = async () => {
    if (!deleting) return;
    try {
      await apiSend(`/api/messages/${deleting.id}`, "DELETE");
      toast({ title: "Pesan dihapus ✓" });
      setReading(null);
      load();
    } catch (e) {
      toast({ title: "Gagal menghapus", description: (e as Error).message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const filters = [
    { value: "all", label: "Semua" },
    { value: "UNREAD", label: "Belum Dibaca" },
    { value: "READ", label: "Dibaca" },
    { value: "REPLIED", label: "Dibalas" },
  ];

  const filtered = (messages || []).filter((m) => filter === "all" || m.status === filter);
  const unreadCount = (messages || []).filter((m) => m.status === "UNREAD").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            Pesan Masuk
            {unreadCount > 0 && <Badge className="bg-destructive text-white">{unreadCount} baru</Badge>}
          </h2>
          <p className="text-sm text-muted-foreground">Inbox pesan dari formulir kontak publik.</p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === f.value ? "bg-primary text-white" : "bg-muted text-foreground/70 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!messages ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card py-16 text-center shadow-sm">
          <Icon name="inbox" className="h-10 w-10 mx-auto text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">Tidak ada pesan pada filter ini.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => setReading(m)}
              className={`w-full text-left rounded-2xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/40 ${
                m.status === "UNREAD" ? "border-l-4 border-l-gold" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className={`text-sm truncate ${m.status === "UNREAD" ? "font-extrabold" : "font-semibold"}`}>
                    {m.status === "UNREAD" && <span className="inline-block h-2 w-2 rounded-full bg-gold mr-2 align-middle" />}
                    {m.subject}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {m.name} · {m.email} · {formatDateTime(m.createdAt)}
                  </p>
                </div>
                <AdminBadge status={m.status} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Read dialog */}
      <Dialog open={!!reading} onOpenChange={(o) => !o && setReading(null)}>
        <DialogContent className="max-w-xl">
          {reading && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">{reading.subject}</DialogTitle>
                <DialogDescription className="text-left">
                  {reading.name} &lt;{reading.email}&gt;{reading.phone ? ` · ${reading.phone}` : ""} · {formatDateTime(reading.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {reading.message}
              </div>
              <div className="flex flex-wrap justify-end gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = `mailto:${reading.email}?subject=Re: ${encodeURIComponent(reading.subject)}`}>
                  <Icon name="mail" className="h-4 w-4 mr-1.5" /> Balas via Email
                </Button>
                {reading.status !== "READ" && reading.status !== "REPLIED" && (
                  <Button variant="outline" size="sm" onClick={() => updateStatus(reading.id, "READ")}>
                    <Icon name="check-circle-2" className="h-4 w-4 mr-1.5" /> Tandai Dibaca
                  </Button>
                )}
                {reading.status !== "REPLIED" && (
                  <Button size="sm" className="bg-gradient-to-r from-primary to-forest text-white" onClick={() => updateStatus(reading.id, "REPLIED")}>
                    <Icon name="send" className="h-4 w-4 mr-1.5" /> Sudah Dibalas
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={() => setDeleting(reading)}>
                  <Icon name="trash" className="h-4 w-4 mr-1.5" /> Hapus
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pesan ini?</AlertDialogTitle>
            <AlertDialogDescription>Pesan akan dihapus permanen dari inbox.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={doDelete}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= PENDAFTARAN (custom) ================= */
export function AdminApplications() {
  const { toast } = useToast();
  const [apps, setApps] = useState<MembershipApplication[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [processing, setProcessing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<MembershipApplication | null>(null);

  const load = useCallback(() => {
    apiGet<MembershipApplication[]>("/api/applications").then(setApps).catch(() => setApps([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (id: string, action: "approve" | "reject") => {
    setProcessing(id + action);
    try {
      await apiSend(`/api/applications/${id}`, "PUT", { action });
      toast({
        title: action === "approve" ? "Pendaftaran disetujui ✓" : "Pendaftaran ditolak",
        description: action === "approve" ? "Organisasi otomatis ditambahkan ke direktori anggota." : undefined,
      });
      load();
    } catch (e) {
      toast({ title: "Gagal memproses", description: (e as Error).message, variant: "destructive" });
    } finally {
      setProcessing(null);
    }
  };

  const doDelete = async () => {
    if (!deleting) return;
    try {
      await apiSend(`/api/applications/${deleting.id}`, "DELETE");
      toast({ title: "Pendaftaran dihapus ✓" });
      load();
    } catch (e) {
      toast({ title: "Gagal menghapus", description: (e as Error).message, variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  const filters = [
    { value: "all", label: "Semua" },
    { value: "PENDING", label: "Menunggu" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  const filtered = (apps || []).filter((a) => filter === "all" || a.status === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-xl font-extrabold">Pendaftaran Keanggotaan</h2>
          <p className="text-sm text-muted-foreground">
            Verifikasi pendaftaran — menyetujui akan otomatis menambahkan organisasi ke direktori anggota.
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === f.value ? "bg-primary text-white" : "bg-muted text-foreground/70 hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {!apps ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card py-16 text-center shadow-sm">
          <Icon name="user-plus" className="h-10 w-10 mx-auto text-muted-foreground/30" />
          <p className="mt-3 text-sm text-muted-foreground">Tidak ada pendaftaran pada filter ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-primary to-forest grid place-items-center text-gold-soft font-extrabold">
                    {a.orgName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{a.orgName}</p>
                    <p className="text-xs text-muted-foreground">{a.type} · Izin {a.licenseNo}</p>
                  </div>
                </div>
                <AdminBadge status={a.status} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <p><span className="text-muted-foreground">Kontak:</span> <b>{a.contactName}</b></p>
                <p><span className="text-muted-foreground">Telp:</span> {a.phone}</p>
                <p className="col-span-2 truncate"><span className="text-muted-foreground">Email:</span> {a.email}</p>
                <p className="col-span-2"><span className="text-muted-foreground">Lokasi:</span> {a.city}{a.province ? `, ${a.province}` : ""}</p>
                {a.message && <p className="col-span-2 text-muted-foreground italic line-clamp-2">“{a.message}”</p>}
                <p className="col-span-2 text-[11px] text-muted-foreground">Diterima: {formatDateTime(a.createdAt)}</p>
              </div>

              {a.status === "PENDING" ? (
                <div className="mt-4 flex gap-2 border-t pt-4">
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-primary to-forest text-white"
                    disabled={processing === a.id + "approve"}
                    onClick={() => act(a.id, "approve")}
                  >
                    {processing === a.id + "approve" ? <Icon name="loader-2" className="h-4 w-4 mr-1.5 animate-spin" /> : <Icon name="check-circle-2" className="h-4 w-4 mr-1.5" />}
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive border-destructive/40 hover:bg-destructive/10"
                    disabled={processing === a.id + "reject"}
                    onClick={() => act(a.id, "reject")}
                  >
                    <Icon name="ban" className="h-4 w-4 mr-1.5" /> Tolak
                  </Button>
                </div>
              ) : (
                <div className="mt-4 flex justify-end border-t pt-4">
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleting(a)}>
                    <Icon name="trash" className="h-4 w-4 mr-1.5" /> Hapus Catatan
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus catatan pendaftaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Catatan pendaftaran {deleting?.orgName} akan dihapus permanen. Data anggota yang sudah disetujui tidak terpengaruh.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={doDelete}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ================= PENGATURAN (custom) ================= */
const SETTING_GROUPS: { title: string; icon: string; keys: { key: string; label: string; multiline?: boolean }[] }[] = [
  {
    title: "Identitas Situs",
    icon: "sparkles",
    keys: [
      { key: "siteName", label: "Nama Situs" },
      { key: "tagline", label: "Tagline" },
      { key: "heroTitle", label: "Judul Hero" },
      { key: "heroSubtitle", label: "Subjudul Hero", multiline: true },
    ],
  },
  {
    title: "Visi & Misi",
    icon: "target",
    keys: [
      { key: "vision", label: "Visi", multiline: true },
      { key: "mission", label: "Misi", multiline: true },
    ],
  },
  {
    title: "Kontak & Alamat",
    icon: "phone",
    keys: [
      { key: "email", label: "Email" },
      { key: "phone", label: "Telepon" },
      { key: "whatsapp", label: "WhatsApp" },
      { key: "address", label: "Alamat", multiline: true },
      { key: "website", label: "Website" },
    ],
  },
  {
    title: "Media Sosial",
    icon: "globe",
    keys: [
      { key: "instagram", label: "Instagram URL" },
      { key: "facebook", label: "Facebook URL" },
      { key: "twitter", label: "Twitter / X URL" },
      { key: "youtube", label: "YouTube URL" },
    ],
  },
];

export function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<SiteSettings>("/api/settings").then(setSettings).catch(() => setSettings({}));
  }, []);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await apiSend("/api/settings", "PUT", settings);
      toast({ title: "Pengaturan tersimpan ✓", description: "Perubahan langsung tampil di situs publik." });
    } catch (e) {
      toast({ title: "Gagal menyimpan", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!settings)
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
      </div>
    );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-extrabold">Pengaturan Situs</h2>
          <p className="text-sm text-muted-foreground">
            Ubah identitas, visi-misi, kontak, dan media sosial portal MUHDIN.
          </p>
        </div>
        <Button
          onClick={save}
          disabled={saving}
          className="sm:ml-auto bg-gradient-to-r from-primary to-forest text-white"
        >
          {saving ? <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="save" className="h-4 w-4 mr-2" />}
          Simpan Semua
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {SETTING_GROUPS.map((g) => (
          <div key={g.title} className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center text-primary">
                <Icon name={g.icon} className="h-4 w-4" />
              </div>
              {g.title}
            </h3>
            <div className="space-y-3.5">
              {g.keys.map((k) => (
                <div key={k.key} className="space-y-1">
                  <Label className="text-xs">{k.label}</Label>
                  {k.multiline ? (
                    <Textarea
                      value={settings[k.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [k.key]: e.target.value })}
                      rows={3}
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      value={settings[k.key] || ""}
                      onChange={(e) => setSettings({ ...settings, [k.key]: e.target.value })}
                      className="text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
