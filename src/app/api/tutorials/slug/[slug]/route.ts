import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-helpers";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const tutorial = await db.tutorial.findUnique({ where: { slug } });
  if (!tutorial || !tutorial.published) return fail("Tutorial tidak ditemukan.", 404);
  await db.tutorial.update({ where: { id: tutorial.id }, data: { views: { increment: 1 } } }).catch(() => {});
  return ok(tutorial);
}
