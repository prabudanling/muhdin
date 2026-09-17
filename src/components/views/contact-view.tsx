"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/client-api";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import type { Faq, SiteSettings } from "@/lib/types";

const CONTACT_CARDS = [
  { icon: "mail", title: "Email Resmi", value: "info@muhdin.web.id", desc: "Respons maksimal 1×24 jam kerja" },
  { icon: "phone", title: "Telepon Sekretariat", value: "+62 21 1234 5678", desc: "Senin–Jumat, 09.00–17.00 WIB" },
  { icon: "map-pin", title: "Alamat", value: "Gedung Asosiasi MUHDIN", desc: "Jakarta Pusat, Indonesia" },
  { icon: "shield-check", title: "Laporan Penipuan", value: "Kanal Prioritas 24/7", desc: "Laporkan pelaku yang mengaku anggota" },
];

export function ContactView() {
  return (
    <div className="flex flex-col">
      <section className="relative bg-forest-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-current opacity-60" />
              Hubungi Kami
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Kanal Resmi MUHDIN</h1>
            <p className="mt-3 max-w-2xl text-emerald-50/80">
              Konsultasi, pertanyaan, laporan, atau masukan — seluruh kanal resmi MUHDIN
              terpusat di halaman ini. Waspadai kanal tidak resmi yang mengatasnamakan MUHDIN.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Contact cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            {CONTACT_CARDS.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="h-full rounded-2xl border bg-card p-5 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 grid place-items-center text-primary">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{c.title}</p>
                  <p className="mt-1 font-bold text-sm break-words">{c.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Tabs defaultValue="pesan" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pesan" className="gap-2">
                <Icon name="message-square" className="h-4 w-4" /> Kirim Pesan
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2">
                <Icon name="help-circle" className="h-4 w-4" /> Tanya Jawab
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pesan">
              <MessageForm />
            </TabsContent>
            <TabsContent value="faq">
              <FaqSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}

function MessageForm() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await apiSend("/api/messages", "POST", form);
      toast({ title: "Pesan terkirim ✓", description: "Terima kasih! Tim MUHDIN akan merespons segera." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (e) {
      toast({ title: "Gagal mengirim", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Reveal>
      <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
        <SectionHeading
          align="left"
          title="Kirim Pesan kepada Sekretariat"
          subtitle="Isi formulir berikut — pesan Anda langsung masuk ke inbox resmi tim MUHDIN."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="c-name">Nama Lengkap *</Label>
            <Input id="c-name" value={form.name} onChange={set("name")} placeholder="Nama Anda" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-email">Email *</Label>
            <Input id="c-email" type="email" value={form.email} onChange={set("email")} placeholder="nama@email.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-phone">Nomor WhatsApp</Label>
            <Input id="c-phone" value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="c-subject">Subjek *</Label>
            <Input id="c-subject" value={form.subject} onChange={set("subject")} placeholder="Perihal pesan" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="c-message">Pesan *</Label>
            <Textarea id="c-message" value={form.message} onChange={set("message")} rows={5} placeholder="Tulis pesan Anda…" />
          </div>
        </div>
        <Button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full sm:w-auto h-11 px-8 bg-gradient-to-r from-primary to-forest text-white"
        >
          {loading ? <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="send" className="h-4 w-4 mr-2" />}
          Kirim Pesan
        </Button>
      </div>
    </Reveal>
  );
}

function FaqSection() {
  const [faqs, setFaqs] = useState<Faq[] | null>(null);

  useEffect(() => {
    apiGet<Faq[]>("/api/faqs").then(setFaqs).catch(() => setFaqs([]));
  }, []);

  if (!faqs)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {faqs.map((f, i) => (
        <Reveal key={f.id} delay={Math.min(i * 0.04, 0.3)}>
          <AccordionItem value={f.id} className="rounded-xl border bg-card px-5 shadow-sm">
            <AccordionTrigger className="text-sm font-bold text-left hover:text-primary hover:no-underline">
              <span className="flex items-center gap-2.5">
                <Icon name="help-circle" className="h-4 w-4 text-primary shrink-0" />
                {f.question}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        </Reveal>
      ))}
    </Accordion>
  );
}
