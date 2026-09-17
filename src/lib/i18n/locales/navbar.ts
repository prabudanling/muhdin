/**
 * namespace "navbar" — dikelola oleh agent Task 14-a.
 * Struktur wajib: { id: {...}, en: {...}, ar: {...} } — key identik di ketiganya.
 */
export const navbarDict = {
  id: {
    navbar: {
      items: {
        beranda: "Beranda",
        nusuk: "Nusuk Hub",
        ekosistem: "13 Ekosistem",
        anggota: "Direktori Anggota",
        tutorial: "Tutorial",
        berita: "Berita",
        tentang: "Tentang",
        kontak: "Kontak",
      },
      portalMitra: "Portal Mitra",
      gabung: "Gabung MUHDIN",
      mobilePortal: "Portal Mitra / Admin",
      aria: {
        brand: "Beranda MUHDIN",
        nav: "Navigasi utama",
        menu: "Buka menu",
        navMobile: "Navigasi mobile",
      },
    },
  },
  en: {
    navbar: {
      items: {
        beranda: "Home",
        nusuk: "Nusuk Hub",
        ekosistem: "13 Ecosystems",
        anggota: "Member Directory",
        tutorial: "Tutorials",
        berita: "News",
        tentang: "About",
        kontak: "Contact",
      },
      portalMitra: "Partner Portal",
      gabung: "Join MUHDIN",
      mobilePortal: "Partner / Admin Portal",
      aria: {
        brand: "MUHDIN home",
        nav: "Main navigation",
        menu: "Open menu",
        navMobile: "Mobile navigation",
      },
    },
  },
  ar: {
    navbar: {
      items: {
        beranda: "الرئيسية",
        nusuk: "مركز نسك",
        ekosistem: "المنظومات الثلاث عشرة",
        anggota: "دليل الأعضاء",
        tutorial: "الدروس التعليمية",
        berita: "الأخبار",
        tentang: "عن مهدين",
        kontak: "اتصل بنا",
      },
      portalMitra: "بوابة الشركاء",
      gabung: "انضم إلى مهدين",
      mobilePortal: "بوابة الشركاء / الإدارة",
      aria: {
        brand: "الصفحة الرئيسية لمهدين",
        nav: "التنقل الرئيسي",
        menu: "فتح القائمة",
        navMobile: "التنقل عبر الجوال",
      },
    },
  },
} as const;
