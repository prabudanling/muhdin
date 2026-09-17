import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardRole, ok, fail } from "@/lib/api-helpers";
import { localeFromRequest, applyEntityTranslations } from "@/lib/i18n-server";

export async function GET(req: NextRequest) {
  try {
    const settings = await db.siteSetting.findMany();
    const localized = await applyEntityTranslations({
      entity: "SiteSetting",
      rows: settings,
      locale: localeFromRequest(req),
      keyOf: (s) => s.key,
      fields: ["value"],
    });
    const map: Record<string, string> = {};
    localized.forEach((s) => (map[s.key] = s.value));
    return ok(map);
  } catch {
    return fail("Gagal memuat pengaturan.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const denied = await guardRole(["SUPER_ADMIN", "ADMIN"]);
  if (denied) return denied;
  try {
    const body = (await req.json()) as Record<string, string>;
    for (const [key, value] of Object.entries(body)) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value: String(value ?? "") },
        create: { key, value: String(value ?? "") },
      });
    }
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => (map[s.key] = s.value));
    return ok(map);
  } catch {
    return fail("Gagal menyimpan pengaturan.", 500);
  }
}
