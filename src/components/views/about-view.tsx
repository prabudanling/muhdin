"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/client-api";
import { navigate } from "@/hooks/use-hash-route";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BRAND, CORE_VALUES, PARTNERS, KPI_ROWS } from "@/lib/constants";
import { useT } from "@/lib/i18n";
import type { ManagementMember, Roadmap, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AboutView() {
  const { t, locale } = useT();
  const [management, setManagement] = useState<ManagementMember[] | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap[] | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    Promise.all([
      apiGet<ManagementMember[]>(`/api/management?locale=${locale}`),
      apiGet<Roadmap[]>(`/api/roadmap?locale=${locale}`),
      apiGet<SiteSettings>(`/api/settings?locale=${locale}`),
    ])
      .then(([management, roadmap, settings]) => ({ management, roadmap, settings }))
      .then((d) => {
        setManagement(d.management);
        setRoadmap(d.roadmap);
        setSettings(d.settings);
      })
      .catch(() => {
        setManagement([]);
        setRoadmap([]);
        setSettings({});
      });
  }, [locale]);

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="relative bg-forest-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-current opacity-60" />
              {t("about.eyebrow")}
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{t("about.title")}</h1>
            <p className="mt-3 max-w-2xl text-emerald-50/80">{t("about.subtitle")}</p>
          </Reveal>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="h-full rounded-3xl border bg-gradient-to-br from-forest to-forest-deep p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
              <div className="relative">
                <Icon name="target" className="h-8 w-8 text-gold" />
                <h2 className="mt-4 text-2xl font-extrabold">{t("about.visionTitle")}</h2>
                <p className="mt-3 text-emerald-50/90 leading-relaxed">
                  {settings?.vision || t("about.visionFallback")}
                </p>
                <p className="mt-6 font-arabic text-2xl text-gold" dir="rtl">{BRAND.arabic}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border bg-card p-8 shadow-sm">
              <Icon name="compass" className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-2xl font-extrabold">{t("about.missionTitle")}</h2>
              <ol className="mt-3 space-y-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/80">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {t(`about.missions.m${i + 1}`)}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prinsip Federasi */}
      <section className="py-14 bg-mint/30 dark:bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("about.fedEyebrow")}
            title={t("about.fedTitle")}
            subtitle={t("about.fedSubtitle")}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "badge-check", title: t("about.principles.p1Title"), desc: t("about.principles.p1Desc") },
              { icon: "scale", title: t("about.principles.p2Title"), desc: t("about.principles.p2Desc") },
              { icon: "bar-chart-3", title: t("about.principles.p3Title"), desc: t("about.principles.p3Desc") },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border bg-card p-6 shadow-sm text-center hover:shadow-lg transition-shadow">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary">
                    <Icon name={c.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold">{c.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mitra list compact */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PARTNERS.map((p, i) => (
              <Reveal key={p.code} delay={i * 0.05}>
                <div className="rounded-xl border bg-card p-4 flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-forest to-primary grid place-items-center text-gold-soft">
                    <Icon name={p.icon} className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-primary">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-snug">{t(`about.partners.${p.code}`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow={t("about.valuesEyebrow")} title={t("about.valuesTitle")} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CORE_VALUES.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.06}>
                <div className="h-full rounded-xl border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Icon name={v.icon} className="h-4.5 w-4.5 text-gold-deep" />
                    <p className="font-bold text-sm">{t(`about.values.${v.name}.name`)}</p>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed line-clamp-4">{t(`about.values.${v.name}.meaning`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Struktur Organisasi */}
      <section className="py-14 bg-mint/30 dark:bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("about.mgmtEyebrow")}
            title={t("about.mgmtTitle")}
            subtitle={t("about.mgmtSubtitle")}
          />
          {!management ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {management.map((m, i) => (
                <Reveal key={m.id} delay={i * 0.07}>
                  <div className="h-full rounded-2xl border bg-card p-6 shadow-sm text-center hover:shadow-lg transition-shadow">
                    <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-forest grid place-items-center text-white text-xl font-extrabold shadow-md">
                      {m.name.replace(/^(H\.|Hj\.|Drs\.|Ir\.|Prof\.)\s*/i, "").charAt(0)}
                    </div>
                    <h3 className="mt-4 font-bold text-sm leading-snug">{m.name}</h3>
                    <Badge className="mt-2 bg-gold/15 text-gold-deep border-gold/30 text-[10px] hover:bg-gold/25">
                      {m.position}
                    </Badge>
                    {m.bio && <p className="mt-2.5 text-xs text-muted-foreground">{m.bio}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Roadmap + KPI */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow={t("about.roadmapEyebrow")}
            title={t("about.roadmapTitle")}
          />
          {!roadmap ? (
            <Skeleton className="mt-10 h-48 rounded-2xl" />
          ) : (
            <div className="mt-10 space-y-4">
              {roadmap.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.06}>
                  <div className={cn("rounded-2xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row gap-5")}>
                    <div className="sm:w-44 shrink-0">
                      <Badge className="bg-primary/10 text-primary border-primary/30 font-bold">{r.period}</Badge>
                      <h3 className="mt-2 font-extrabold text-primary">{r.phase}</h3>
                      <p className="text-xs font-semibold text-foreground/60 mt-1">{r.focus}</p>
                    </div>
                    <div className="sm:border-s sm:border-border sm:ps-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-gold-deep mb-1.5">{t("about.deliverablesLabel")}</p>
                      <p className="text-sm text-foreground/75 leading-relaxed">{r.deliverables}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          )}

          {/* KPI Table */}
          <Reveal className="mt-14">
            <h3 className="text-xl font-extrabold mb-1">{t("about.kpi.title")}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("about.kpi.subtitle")}</p>
            <div className="rounded-2xl border overflow-hidden shadow-sm max-h-96 overflow-y-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-primary text-white">
                  <TableRow className="hover:bg-primary">
                    <TableHead className="text-white font-bold">{t("about.kpi.colIndicator")}</TableHead>
                    <TableHead className="text-white font-bold">{t("about.kpi.colBaseline")}</TableHead>
                    <TableHead className="text-white font-bold">{t("about.kpi.colTarget")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {KPI_ROWS.map((_, i) => (
                    <TableRow key={`about.kpi.rows.r${i + 1}`} className={i % 2 ? "bg-muted/40" : ""}>
                      <TableCell className="font-medium text-sm">{t(`about.kpi.rows.r${i + 1}.indicator`)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t(`about.kpi.rows.r${i + 1}.baseline`)}</TableCell>
                      <TableCell className="text-sm font-bold text-primary">{t(`about.kpi.rows.r${i + 1}.target`)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Reveal>

          <Reveal className="mt-12 text-center">
            <Button size="lg" onClick={() => navigate("gabung")} className="bg-gradient-to-r from-primary to-forest text-white">
              <Icon name="handshake" className="h-5 w-5 me-2" />
              {t("about.cta")}
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
