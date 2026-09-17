import { cookies } from "next/headers";
import MuhdinApp from "@/components/muhdin-app";

export default async function Page() {
  // Locale tersimpan di cookie agar SSR (html lang/dir + teks) langsung
  // konsisten dengan client — bebas hydration mismatch.
  const store = await cookies();
  const raw = store.get("muhdin-locale")?.value;
  const initialLocale = raw === "en" || raw === "ar" ? raw : "id";
  return <MuhdinApp initialLocale={initialLocale} />;
}
