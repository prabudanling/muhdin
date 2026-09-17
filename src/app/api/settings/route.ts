import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardAdmin, ok, fail } from "@/lib/api-helpers";

export async function GET() {
  try {
    const settings = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => (map[s.key] = s.value));
    return ok(map);
  } catch {
    return fail("Gagal memuat pengaturan.", 500);
  }
}

export async function PUT(req: NextRequest) {
  const denied = await guardAdmin();
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
