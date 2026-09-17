"use client";

import { useEffect, useMemo, useState } from "react";
import { apiGet } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import { TUTORIAL_CATEGORIES } from "@/lib/constants";
import type { Tutorial } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVEL_COLORS: Record<string, string> = {
  Pemula: "bg-primary/10 text-primary border-primary/30",
  Menengah: "bg-gold/15 text-gold-deep border-gold/40",
  Mahir: "bg-forest/15 text-forest border-forest/40",
};

export function TutorialView({ slug }: { slug?: string }) {
  if (slug) return <TutorialDetail slug={slug} />;
  return <TutorialList />;
}

function TutorialList() {
  const [tutorials, setTutorials] = useState<Tutorial[] | null>(null);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    apiGet<Tutorial[]>("/api/tutorials").then(setTutorials).catch(() => setTutorials([]));
  }, []);

  const filtered = useMemo(() => {
    if (!tutorials) return [];
    return tutorials.filter((t) => {
      const okCat = cat === "all" || t.category === cat;
      const okQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.summary.toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [tutorials, cat, q]);

  return (
    <div className="flex flex-col">
      <section className="relative bg-forest-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-current opacity-60" />
              Pusat Bantuan
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Pusat Tutorial &amp; Panduan</h1>
            <p className="mt-3 max-w-2xl text-emerald-50/80">
              Panduan lengkap untuk jamaah, calon mitra, dan administrator CMS — dari cek
              verifikasi penyelenggara hingga mengelola konten portal.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-3 mb-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-0.5">
              <FilterChip active={cat === "all"} onClick={() => setCat("all")} label="Semua" />
              {TUTORIAL_CATEGORIES.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setCat(c)} label={c} />
              ))}
            </div>
            <div className="relative lg:ml-auto w-full lg:w-72">
              <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari tutorial…" className="pl-9" />
            </div>
          </div>

          {!tutorials ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <Icon name="help-circle" className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="mt-3 text-muted-foreground">Tidak ada tutorial yang cocok.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i * 0.04, 0.4)}>
                  <button
                    onClick={() => navigate(`tutorial/${t.slug}`)}
                    className="group h-full w-full text-left rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        <Icon name="graduation-cap" className="h-3 w-3 mr-1 text-primary" />
                        {t.category}
                      </Badge>
                      <Badge variant="outline" className={cn("text-[10px] font-bold", LEVEL_COLORS[t.level])}>
                        {t.level}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {t.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{t.summary}</p>
                    <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="clock" className="h-3.5 w-3.5" /> {t.duration} menit
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="eye" className="h-3.5 w-3.5" /> {t.views}× dibaca
                      </span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
        active ? "bg-primary text-white shadow-md" : "bg-muted text-foreground/70 hover:bg-primary/10 hover:text-primary"
      )}
    >
      {label}
    </button>
  );
}

function TutorialDetail({ slug }: { slug: string }) {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet<Tutorial>(`/api/tutorials/slug/${slug}`)
      .then(setTutorial)
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error)
    return (
      <div className="py-24 text-center">
        <Icon name="alert-triangle" className="h-10 w-10 mx-auto text-destructive" />
        <p className="mt-3 text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("tutorial")}>
          Kembali ke Tutorial
        </Button>
      </div>
    );

  if (!tutorial)
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );

  return (
    <div className="py-12">
      <article className="mx-auto max-w-4xl px-4 sm:px-6">
        <Button variant="ghost" onClick={() => navigate("tutorial")} className="mb-6 -ml-2 text-primary">
          <Icon name="arrow-right" className="h-4 w-4 rotate-180 mr-1.5" />
          Semua Tutorial
        </Button>

        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">
              <Icon name="graduation-cap" className="h-3 w-3 mr-1 text-primary" />
              {tutorial.category}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] font-bold", LEVEL_COLORS[tutorial.level])}>
              {tutorial.level}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="clock" className="h-3.5 w-3.5" /> {tutorial.duration} menit baca
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="eye" className="h-3.5 w-3.5" /> {tutorial.views}× dibaca
            </span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{tutorial.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{tutorial.summary}</p>
          <div className="gold-divider mt-6" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="markdown-body mt-8 max-w-none">
            <ReactMarkdown>{tutorial.content}</ReactMarkdown>
          </div>
        </Reveal>

        <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
          <p className="font-bold">Butuh bantuan lebih lanjut?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tim MUHDIN siap membantu melalui kanal resmi.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={() => navigate("kontak")}>
              <Icon name="message-square" className="h-4 w-4 mr-1.5" /> Hubungi Kami
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("tutorial")}>
              <Icon name="rotate" className="h-4 w-4 mr-1.5" /> Tutorial Lain
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
