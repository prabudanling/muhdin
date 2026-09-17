import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardAdmin, ok, fail } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  try {
    const cluster = req.nextUrl.searchParams.get("cluster") || undefined;
    const ecosystems = await db.ecosystem.findMany({
      where: cluster ? { cluster } : {},
      orderBy: { number: "asc" },
    });
    return ok(ecosystems);
  } catch {
    return fail("Gagal memuat ekosistem.", 500);
  }
}

export async function POST(req: NextRequest) {
  const denied = await guardAdmin();
  if (denied) return denied;
  try {
    const body = await req.json();
    const number = parseInt(body.number, 10);
    if (!body.name || Number.isNaN(number)) return fail("Nomor dan nama ekosistem wajib diisi.");
    const ecosystem = await db.ecosystem.create({
      data: {
        number,
        name: String(body.name),
        cluster: String(body.cluster || "Akses & Mobilitas"),
        scope: String(body.scope || ""),
        standard: String(body.standard || ""),
        icon: String(body.icon || "hexagon"),
        color: String(body.color || "emerald"),
        description: String(body.description || ""),
        image: body.image ? String(body.image) : null,
      },
    });
    return ok(ecosystem, 201);
  } catch {
    return fail("Gagal membuat ekosistem — nomor mungkin sudah dipakai.", 500);
  }
}
