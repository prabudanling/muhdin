import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardAdmin, ok, fail } from "@/lib/api-helpers";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    if (body.name !== undefined) data.name = String(body.name);
    if (body.type !== undefined) data.type = String(body.type);
    if (body.city !== undefined) data.city = String(body.city);
    if (body.province !== undefined) data.province = String(body.province);
    if (body.licenseNo !== undefined) data.licenseNo = String(body.licenseNo);
    if (body.phone !== undefined) data.phone = body.phone ? String(body.phone) : null;
    if (body.email !== undefined) data.email = body.email ? String(body.email) : null;
    if (body.website !== undefined) data.website = body.website ? String(body.website) : null;
    if (body.description !== undefined) data.description = body.description ? String(body.description) : null;
    if (body.rating !== undefined) data.rating = parseFloat(body.rating) || 4.5;
    if (body.status !== undefined) data.status = String(body.status);
    if (body.memberSince !== undefined) data.memberSince = parseInt(body.memberSince, 10) || new Date().getFullYear();
    const member = await db.member.update({ where: { id }, data });
    return ok(member);
  } catch {
    return fail("Gagal memperbarui anggota.", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guardAdmin();
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await db.member.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Gagal menghapus anggota.", 500);
  }
}
