import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardRole, ok, fail } from "@/lib/api-helpers";

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guardRole(["SUPER_ADMIN", "ADMIN"]);
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    const body = await req.json();
    const action = String(body.action || "");
    if (action === "approve") {
      const app = await db.membershipApplication.update({ where: { id }, data: { status: "APPROVED" } });
      // Buat anggota otomatis dari pendaftaran yang disetujui
      const existing = await db.member.findFirst({ where: { licenseNo: app.licenseNo } });
      if (!existing) {
        await db.member.create({
          data: {
            name: app.orgName,
            type: app.type,
            city: app.city,
            province: app.province,
            licenseNo: app.licenseNo,
            phone: app.phone,
            email: app.email,
            status: "TERVERIFIKASI",
            memberSince: new Date().getFullYear(),
            description: app.message,
          },
        });
      }
      return ok(app);
    }
    if (action === "reject") {
      const app = await db.membershipApplication.update({ where: { id }, data: { status: "REJECTED" } });
      return ok(app);
    }
    return fail("Aksi tidak dikenal.");
  } catch {
    return fail("Gagal memproses pendaftaran.", 500);
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const denied = await guardRole(["SUPER_ADMIN", "ADMIN"]);
  if (denied) return denied;
  const { id } = await ctx.params;
  try {
    await db.membershipApplication.delete({ where: { id } });
    return ok({ success: true });
  } catch {
    return fail("Gagal menghapus pendaftaran.", 500);
  }
}
