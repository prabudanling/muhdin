/**
 * nusantara.ts — Konstanta platform MUHDIN NUSANTARA (Task 33, Master Rebuild).
 *
 * Trusted Pilgrim Ecosystem — One Ecosystem. One Standard. One Trust. One Journey.
 *
 * ATURAN EMAS (ROLE 25 — Legal/Compliance Guard):
 *  - Tidak ada klaim dukungan/endorsement pemerintah.
 *  - MUHDIN bukan PPIU/PIHK, bukan penerbit visa, bukan penjamin keberangkatan.
 *  - "MUHDIN Verified" = status verifikasi internal berbasis dokumen pada tanggal
 *    verifikasi — BUKAN izin/accreditasi pemerintah.
 *  - Biaya keanggotaan = iuran organisasi MUHDIN, bukan biaya/izin pemerintah.
 *
 * Label tampilan (id/en/ar) hidup di kamus i18n namespace "nusHome"/"nusJoin"/"nusTrust";
 * konstanta ini hanya memuat kode, ikon, harga, dan urutan — sumber kebenaran tunggal
 * untuk struktur data lintas halaman.
 */

/** Alur hero: Indonesia → MUHDIN → PPIU/PIHK → Saudi Providers → Jamaah. */
export const HERO_FLOW = ["INDONESIA", "MUHDIN", "PPIU_PIHK", "SAUDI", "JAMAAH"] as const;

/** ROLE 07 §2 — empat pilar "The Idea". */
export const PILLARS = ["CONNECT", "VERIFY", "COLLABORATE", "INTEGRATE"] as const;

/** ROLE 07 §3 — 14 kategori ekosistem (grid halaman utama). */
export const ECOSYSTEM_CATEGORIES: { code: string; icon: string }[] = [
  { code: "PPIU", icon: "plane-takeoff" },
  { code: "PIHK", icon: "landmark" },
  { code: "KBIHU", icon: "users" },
  { code: "TRAVEL", icon: "compass" },
  { code: "SAUDI_PROVIDER", icon: "building-2" },
  { code: "HOTEL", icon: "building" },
  { code: "TICKETING", icon: "plane" },
  { code: "VISA_DOC", icon: "passport" },
  { code: "TRANSPORT", icon: "bus" },
  { code: "INSURANCE", icon: "shield-check" },
  { code: "HEALTH", icon: "heart-pulse" },
  { code: "PROFESSIONAL", icon: "graduation-cap" },
  { code: "TECHNOLOGY", icon: "brain-circuit" },
  { code: "STRATEGIC_PARTNER", icon: "handshake" },
];

/** ROLE 07 §5 — 7 langkah onboarding (timeline animasi). */
export const ONBOARDING_STEPS = [
  "REGISTER",
  "COMPLETE_PROFILE",
  "DOCUMENT_REVIEW",
  "VERIFICATION",
  "MUHDIN_ID",
  "CONNECT",
  "COLLABORATE",
] as const;

/** ROLE 07 §6 — 9 node jaringan, MUHDIN di pusat. */
export const NETWORK_NODES = [
  "PPIU",
  "PIHK",
  "KBIHU",
  "SUPPLIER",
  "SAUDI",
  "PROFESSIONAL",
  "TECHNOLOGY",
  "PARTNER",
  "JAMAAH",
] as const;

/** ROLE 07 §8 — 5 tier keanggotaan (harga Founding 2026). */
export const MEMBERSHIP_TIERS: { code: string; icon: string; price: string; period: string }[] = [
  { code: "INDIVIDUAL", icon: "user", price: "Rp150.000", period: "/tahun" },
  { code: "PROFESSIONAL", icon: "graduation-cap", price: "Rp300.000", period: "/tahun" },
  { code: "ORGANIZATION", icon: "building", price: "Rp1.500.000", period: "/tahun" },
  { code: "PPIU_PIHK", icon: "plane-takeoff", price: "Rp3.000.000", period: "/tahun" },
  { code: "STRATEGIC_PARTNER", icon: "handshake", price: "By Agreement", period: "" },
];

/** ROLE 07 §9 — 6 topik MUHDIN Academy. */
export const ACADEMY_TOPICS = [
  "DIGITAL_UMRAH",
  "PPIU_OPERATIONS",
  "SAUDI_OPERATIONS",
  "COMPLIANCE",
  "TECHNOLOGY",
  "PROFESSIONAL_DEVELOPMENT",
] as const;

/** ROLE 08 — 17 pilihan peran pendaftaran + pemetaan ke `type` aplikasi backend. */
export const REG_ROLES: { code: string; icon: string; type: string; group: string }[] = [
  // Individu & Komunitas
  { code: "INDIVIDUAL", icon: "user", type: "INDIVIDUAL", group: "INDIVIDU" },
  { code: "PROFESSIONAL", icon: "graduation-cap", type: "PROFESSIONAL", group: "INDIVIDU" },
  { code: "JAMAAH", icon: "heart-handshake", type: "JAMAAH", group: "INDIVIDU" },
  // Organisasi
  { code: "ORGANIZATION", icon: "building", type: "ORGANIZATION", group: "ORGANISASI" },
  { code: "PPIU", icon: "plane-takeoff", type: "PPIU", group: "ORGANISASI" },
  { code: "PIHK", icon: "landmark", type: "PIHK", group: "ORGANISASI" },
  { code: "KBIHU", icon: "users", type: "KBIHU", group: "ORGANISASI" },
  // Penyedia layanan (Indonesia & Saudi)
  { code: "PROVIDER_ID", icon: "compass", type: "PROVIDER", group: "PENYEDIA" },
  { code: "PROVIDER_SAUDI", icon: "building-2", type: "PROVIDER", group: "PENYEDIA" },
  { code: "VISA_DOC", icon: "passport", type: "PROVIDER", group: "PENYEDIA" },
  { code: "HOTEL", icon: "building", type: "PROVIDER", group: "PENYEDIA" },
  { code: "TICKETING", icon: "plane", type: "PROVIDER", group: "PENYEDIA" },
  { code: "TRANSPORT", icon: "bus", type: "PROVIDER", group: "PENYEDIA" },
  { code: "INSURANCE", icon: "shield-check", type: "PROVIDER", group: "PENYEDIA" },
  { code: "HEALTH", icon: "heart-pulse", type: "PROVIDER", group: "PENYEDIA" },
  // Teknologi & Kemitraan
  { code: "TECHNOLOGY", icon: "brain-circuit", type: "TECHNOLOGY", group: "TEKNOLOGI_PARTNER" },
  { code: "STRATEGIC_PARTNER", icon: "handshake", type: "PARTNER", group: "TEKNOLOGI_PARTNER" },
];

/** ROLE 12 — arsitektur status verifikasi (11 status; string bebas di DB). */
export const VERIFY_STATUSES: Record<string, { label: string; tone: string }> = {
  REGISTERED: { label: "Terdaftar", tone: "slate" },
  PROFILE_COMPLETE: { label: "Profil Lengkap", tone: "slate" },
  DOCUMENT_INCOMPLETE: { label: "Dokumen Belum Lengkap", tone: "amber" },
  UNDER_REVIEW: { label: "Sedang Ditinjau", tone: "amber" },
  VERIFICATION_CALL: { label: "Panggilan Verifikasi", tone: "amber" },
  VERIFIED: { label: "Terverifikasi", tone: "green" },
  VERIFIED_LIMITED: { label: "Terverifikasi Terbatas", tone: "amber" },
  PARTNER: { label: "Mitra Strategis", tone: "gold" },
  EXPIRED: { label: "Kedaluwarsa", tone: "slate" },
  SUSPENDED: { label: "Ditangguhkan", tone: "red" },
  REJECTED: { label: "Ditolak", tone: "red" },
  // Status warisan sistem lama (tetap dikenali):
  TERVERIFIKASI: { label: "Terverifikasi", tone: "green" },
  PENDING: { label: "Menunggu Verifikasi", tone: "amber" },
};

/** Format ID verifikasi publik: MHD-VER-000127 (dari nomor urut verifikasi). */
export function formatVerifyId(numericId: number): string {
  return `MHD-VER-${String(numericId).padStart(6, "0")}`;
}

/** ROLE 07 §1 — subheadline hero (Bahasa Indonesia, tone hangat-profesional). */
export const HERO_SUBTITLE =
  "Menghubungkan penyelenggara, pelaku usaha, profesional, teknologi, dan penyedia layanan haji–umrah dalam satu ekosistem yang lebih terpercaya, transparan, dan terintegrasi.";

/** ROLE 25 — disclaimer wajib MUHDIN Verified (teks resmi — JANGAN diubah tanpa tinjauan hukum). */
export const VERIFIED_DISCLAIMER_ID =
  "Status MUHDIN Verified menunjukkan bahwa MUHDIN telah melakukan pemeriksaan atas data/dokumen tertentu berdasarkan informasi yang tersedia pada tanggal verifikasi. Status ini bukan izin pemerintah, bukan akreditasi pemerintah, bukan jaminan keberangkatan, bukan jaminan visa, dan bukan jaminan atas transaksi.";
