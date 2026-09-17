import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "MUHDIN — Masyarakat Umroh Haji Digital Nusantara",
    template: "%s | MUHDIN",
  },
  description:
    "Portal resmi MUHDIN (Masyarakat Umroh Haji Digital Nusantara) — Asosiasi di Atas Asosiasi Penyelenggara Ibadah, Operator Nusuk Indonesia. 13 Ekosistem layanan umroh-haji terintegrasi menuju Transformasi Digitalisasi 2030. Bersama Melayani Tamu Allah.",
  keywords: [
    "MUHDIN",
    "umroh",
    "haji",
    "Nusuk",
    "PPIU",
    "PIHK",
    "KBIHU",
    "IPHI",
    "travel umroh terpercaya",
    "operator nusuk indonesia",
    "13 ekosistem MUHDIN",
    "transformasi digital umroh",
  ],
  authors: [{ name: "MUHDIN" }],
  openGraph: {
    title: "MUHDIN — Bersama Melayani Tamu Allah",
    description:
      "Asosiasi di Atas Asosiasi Penyelenggara Ibadah — Operator Nusuk Indonesia. 13 Ekosistem layanan umroh-haji terintegrasi menuju 2030.",
    siteName: "MUHDIN",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "MUHDIN — Masyarakat Umroh Haji Digital Nusantara",
    description:
      "13 Ekosistem layanan umroh-haji terintegrasi. Bersama Melayani Tamu Allah.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b5c3f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${amiri.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
