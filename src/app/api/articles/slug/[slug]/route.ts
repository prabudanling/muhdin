import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api-helpers";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const article = await db.article.findUnique({ where: { slug } });
  if (!article) return fail("Artikel tidak ditemukan.", 404);
  if (article.status !== "PUBLISHED") return fail("Artikel tidak ditemukan.", 404);
  await db.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(() => {});
  return ok(article);
}
