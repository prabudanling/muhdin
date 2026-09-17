import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardRole, ok, fail } from "@/lib/api-helpers";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guardRole(["SUPER_ADMIN", "ADMIN"]);
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const status = String(body.status || "READ");
    const msg = await db.contactMessage.update({ where: { id }, data: { status } });
    return ok(msg);
  } catch {
    return fail("Gagal memperbarui pesan.", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guardRole(["SUPER_ADMIN", "ADMIN"]);
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await db.contactMessage.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Gagal menghapus pesan.", 500);
  }
}
