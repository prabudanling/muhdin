import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { guardAdmin, ok, fail } from "@/lib/api-helpers";

export async function GET() {
  const denied = await guardAdmin();
  if (denied) return denied;
  try {
    const applications = await db.membershipApplication.findMany({ orderBy: { createdAt: "desc" } });
    return ok(applications);
  } catch {
    return fail("Gagal memuat pendaftaran.", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const required = ["orgName", "type", "contactName", "email", "phone", "city", "licenseNo"];
    for (const f of required) {
      if (!String(body[f] || "").trim()) return fail(`Kolom ${f} wajib diisi.`);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(body.email))) return fail("Format email tidak valid.");
    const app = await db.membershipApplication.create({
      data: {
        orgName: String(body.orgName).trim(),
        type: String(body.type),
        contactName: String(body.contactName).trim(),
        email: String(body.email).trim(),
        phone: String(body.phone).trim(),
        city: String(body.city).trim(),
        province: String(body.province || "").trim(),
        licenseNo: String(body.licenseNo).trim(),
        message: body.message ? String(body.message) : null,
      },
    });
    return ok(app, 201);
  } catch {
    return fail("Gagal mengirim pendaftaran.", 500);
  }
}
