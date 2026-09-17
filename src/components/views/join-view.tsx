"use client";

import { useState } from "react";
import { apiSend } from "@/lib/client-api";
import { Icon } from "@/components/site/icon";
import { Reveal, SectionHeading } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MEMBER_TYPES, MEMBER_TYPE_LABEL, PARTNERS } from "@/lib/constants";

const PROCESS_STEPS = [
  { icon: "file-text", title: "Isi Formulir", desc: "Lengkapi data organisasi dan nomor izin resmi Kemenag RI." },
  { icon: "shield-check", title: "Verifikasi Rekam Jejak", desc: "Tim MUHDIN memverifikasi legalitas dan rekam jejak layanan." },
  { icon: "handshake", title: "Persetujuan Keanggotaan", desc: "Dewan Pengurus menyetujui keanggotaan dan menetapkan kelas layanan." },
  { icon: "sparkles", title: "Onboarding Ekosistem", desc: "Integrasi ke MUHDIN App, dashboard, dan program sertifikasi SDM." },
];

export function JoinView() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    orgName: "",
    type: "PPIU",
    contactName: "",
    email: "",
    phone: "",
    city: "",
    province: "",
    licenseNo: "",
    message: "",
  });

  const submit = async () => {
    setLoading(true);
    try {
      await apiSend("/api/applications", "POST", form);
      toast({
        title: "Pendaftaran terkirim ✓",
        description: "Selamat! Tim verifikasi MUHDIN akan menghubungi Anda melalui email.",
      });
      setForm({ orgName: "", type: "PPIU", contactName: "", email: "", phone: "", city: "", province: "", licenseNo: "", message: "" });
    } catch (e) {
      toast({ title: "Gagal mengirim", description: (e as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col">
      <section className="relative bg-forest-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern-gold opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              <span className="h-px w-6 bg-current opacity-60" />
              Keanggotaan
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Bergabung dengan MUHDIN</h1>
            <p className="mt-3 max-w-2xl text-emerald-50/80">
              Terbuka bagi PPIU, PIHK, KBIHU, IPHI, dan penyelenggara travel wisata halal-ziarah
              yang memiliki izin resmi, rekam jejak dapat diverifikasi, dan komitmen pada standar ekosistem.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Manfaat & proses */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-14">
            {PROCESS_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="relative h-full rounded-2xl border bg-card p-5 shadow-sm overflow-hidden">
                  <span className="absolute -right-2 -top-3 text-6xl font-extrabold text-primary/5 select-none">{i + 1}</span>
                  <div className="h-10 w-10 rounded-xl bg-gold/15 grid place-items-center text-gold-deep">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-bold text-sm">{s.title}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Manfaat keanggotaan */}
            <Reveal className="lg:col-span-2">
              <div className="rounded-3xl bg-gradient-to-br from-forest to-forest-deep p-8 text-white h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-islamic-pattern-gold opacity-30" />
                <div className="relative">
                  <h2 className="text-2xl font-extrabold">Manfaat Keanggotaan</h2>
                  <div className="gold-divider w-24 mt-3" />
                  <ul className="mt-6 space-y-4">
                    {[
                      { icon: "git-merge", text: "Akses kolektif ke Nusuk — efisiensi biaya transaksi dan kepastian kuota" },
                      { icon: "smartphone", text: "Langganan MUHDIN App & dashboard monitoring dengan tarif mitra" },
                      { icon: "badge-check", text: "Kredibilitas melalui rating mutu publik dan badge terverifikasi" },
                      { icon: "users", text: "Aliran jamaah dari kanal terverifikasi MUHDIN" },
                      { icon: "graduation-cap", text: "Program sertifikasi tour leader & mutawif" },
                      { icon: "wallet", text: "Perlindungan dana jamaah melalui standar escrow & takaful" },
                    ].map((b) => (
                      <li key={b.text} className="flex gap-3 text-sm text-emerald-50/90">
                        <span className="shrink-0 h-8 w-8 rounded-lg bg-gold/20 grid place-items-center text-gold">
                          <Icon name={b.icon} className="h-4 w-4" />
                        </span>
                        {b.text}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 text-xs text-emerald-100/60 leading-relaxed">
                    Iuran keanggotaan berjenjang sesuai kelas layanan dan skala operasi — berakar
                    pada akad wakalah, ijarah, ju&apos;alah, dan musyarakah yang jelas.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1} className="lg:col-span-3">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-sm">
                <SectionHeading
                  align="left"
                  title="Formulir Pendaftaran Anggota"
                  subtitle="Seluruh data bersifat rahasia dan hanya digunakan untuk proses verifikasi keanggotaan."
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Nama Organisasi *</Label>
                    <Input value={form.orgName} onChange={set("orgName")} placeholder="Contoh: PT Insan Barokah Wisata" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Jenis Mitra *</Label>
                    <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        {MEMBER_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {MEMBER_TYPE_LABEL[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nomor Izin (Kemenag RI) *</Label>
                    <Input value={form.licenseNo} onChange={set("licenseNo")} placeholder="Contoh: PPIU-2026-0123" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nama Kontak Penanggung Jawab *</Label>
                    <Input value={form.contactName} onChange={set("contactName")} placeholder="Nama lengkap" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input type="email" value={form.email} onChange={set("email")} placeholder="email@organisasi.id" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nomor Telepon / WhatsApp *</Label>
                    <Input value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Kota *</Label>
                    <Input value={form.city} onChange={set("city")} placeholder="Kota domisili" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Provinsi</Label>
                    <Input value={form.province} onChange={set("province")} placeholder="Provinsi" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Profil Singkat Organisasi</Label>
                    <Textarea
                      value={form.message}
                      onChange={set("message")}
                      rows={4}
                      placeholder="Ceritakan pengalaman organisasi Anda: tahun berdiri, volume jamaah per tahun, dan komitmen terhadap standar mutu…"
                    />
                  </div>
                </div>
                <Button
                  onClick={submit}
                  disabled={loading}
                  className="mt-6 w-full h-12 text-base bg-gradient-to-r from-primary to-forest text-white shadow-lg hover:shadow-xl"
                >
                  {loading ? <Icon name="loader-2" className="h-4 w-4 mr-2 animate-spin" /> : <Icon name="send" className="h-4 w-4 mr-2" />}
                  Kirim Pendaftaran Keanggotaan
                </Button>
                <p className="mt-3 text-[11px] text-muted-foreground text-center">
                  Dengan mengirim formulir, organisasi menyatakan kesediaan mengikuti proses verifikasi
                  rekam jejak dan komitmen terhadap standar ekosistem MUHDIN.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Jenis mitra ringkas */}
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {PARTNERS.map((p, i) => (
              <Reveal key={p.code} delay={i * 0.05}>
                <div className="rounded-xl border bg-muted/30 p-4 text-center h-full">
                  <Icon name={p.icon} className="h-6 w-6 mx-auto text-primary" />
                  <p className="mt-2 text-sm font-extrabold text-primary">{p.name}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground leading-snug">{p.fullName}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
