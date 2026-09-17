/**
 * roles.ts — model peran multi-admin (Task 15-c).
 * Dipakai bersama oleh API routes (server) dan UI CMS (client).
 *
 * SUPER_ADMIN : seluruh akses + kelola admin (tambah/ubah/nonaktif/hapus).
 * ADMIN       : seluruh modul operasional, kecuali kelola admin.
 * EDITOR      : fokus konten (berita, tutorial, FAQ, testimoni, dll).
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};

export function isRole(value: string): value is Role {
  return (ROLES as string[]).includes(value);
}

/** Semua modul CMS + peran yang boleh melihatnya (urutan = urutan menu). */
export const SECTION_ROLES: { id: string; roles: Role[] }[] = [
  { id: "dashboard", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "nusuk", roles: ["SUPER_ADMIN", "ADMIN"] },
  { id: "articles", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "ecosystems", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "journey", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "roadmap", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "members", roles: ["SUPER_ADMIN", "ADMIN"] },
  { id: "applications", roles: ["SUPER_ADMIN", "ADMIN"] },
  { id: "tutorials", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "messages", roles: ["SUPER_ADMIN", "ADMIN"] },
  { id: "faqs", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "testimonials", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "management", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "settings", roles: ["SUPER_ADMIN", "ADMIN"] },
  { id: "translator", roles: ["SUPER_ADMIN", "ADMIN", "EDITOR"] },
  { id: "users", roles: ["SUPER_ADMIN"] },
];

/** Daftar id modul yang boleh dilihat oleh suatu peran (untuk gating menu UI). */
export function visibleSections(role: string | null | undefined): Set<string> {
  const set = new Set<string>();
  for (const s of SECTION_ROLES) {
    if (role && (s.roles as string[]).includes(role)) set.add(s.id);
  }
  return set;
}

/** Boleh mengelola akun admin lain = hanya SUPER_ADMIN. */
export function canManageUsers(role: string | null | undefined): boolean {
  return role === "SUPER_ADMIN";
}
