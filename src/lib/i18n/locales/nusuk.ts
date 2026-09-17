/**
 * namespace "nusuk" — dikelola oleh agent Task 14-d (Nusuk Hub).
 * Struktur wajib: { id: {...}, en: {...}, ar: {...} } — key identik di ketiganya.
 * Key datar satu level di dalam namespace (tanpa "." dalam nama key).
 * Nilai id = string ASLI dari nusuk-view.tsx (tidak diparafrase).
 */
export const nusukDict = {
  id: {
    nusuk: {
      /* ---------- HERO ---------- */
      heroTitle1: "Terhubung Langsung dengan",
      heroTitle2: "Platform Nusuk",
      heroDescAuto1:
        "Jembatan data resmi ekosistem MUHDIN ke Nusuk — platform digital Kementerian Hajj & Umrah Kerajaan Saudi Arabia. Sinkronisasi otomatis berjalan dan telah tercatat",
      heroDescManual1:
        "Jembatan data resmi ekosistem MUHDIN ke Nusuk — platform digital Kementerian Hajj & Umrah Kerajaan Saudi Arabia. Sinkronisasi dijalankan manual dan telah tercatat",
      heroDescPost: "pada lingkungan {env}.",
      heroLoading:
        "Mengambil status koneksi dari registri Nusuk Kementerian Hajj & Umrah Kerajaan Saudi Arabia…",
      chipConnected: "Terhubung",
      chipDisconnected: "Terputus",
      ariaConnStatus: "Status koneksi Nusuk",
      lastSync: "Sinkron terakhir: {ago}",

      /* ---------- RELATIF WAKTU & DURASI ---------- */
      agoNever: "belum pernah",
      agoSec: "{n} detik lalu",
      agoMin: "{n} menit lalu",
      agoHour: "{n} jam lalu",
      agoDay: "{n} hari lalu",
      durMs: "{n} ms",
      durSec: "{n} dtk",

      /* ---------- METRIK LIVE ---------- */
      metricsEyebrow: "Live Metrics",
      metricsTitle: "Denyut Integrasi Nusuk",
      metricsSubtitle:
        "Angka real-time dari registri izin ekosistem MUHDIN yang tersinkron dengan platform Nusuk.",
      statActivePermits: "Izin Aktif",
      statMembersSynced: "Anggota Tersinkron",
      statSyncSuccess: "Tingkat Sukses Sinkron",
      statTotalSyncs: "Total Sinkronisasi",
      byTypeLabel: "Izin per tipe",
      typeChipTitle: "{label}: {total} total, {active} aktif",
      typeChip: "{total} total · {active} aktif",
      avgLine: "Rata-rata {dur} · {n} sinkron / 7 hari",

      /* ---------- CEK IZIN (PERMIT CHECKER) ---------- */
      checkerEyebrow: "Permit Checker",
      checkerTitle: "Cek Keaslian Izin Nusuk",
      checkerSubtitle:
        "Alat publik gratis untuk jamaah dan mitra: masukkan nomor izin dan dapatkan status resminya dalam sekejap.",
      checkerCardTitle: "Cek Izin Nusuk",
      checkerCardDesc: "Verifikasi keaslian izin yang diterbitkan melalui integrasi Nusuk–MUHDIN.",
      checkerPlaceholder: "Contoh: NSK-VSA-2026-482913",
      ariaPermitNo: "Nomor izin Nusuk",
      ariaVerifyNow: "Verifikasi nomor izin sekarang",
      verifyNow: "Verifikasi Sekarang",
      checkerHint:
        "Nomor izin tercantum pada bukti pemesanan dari penyelenggara terverifikasi MUHDIN.",
      errEmptyNo: "Masukkan nomor izin Nusuk terlebih dahulu.",
      verifyFailed: "Verifikasi gagal",
      checkedLine: "{env} · dicek {ago}",
      permitNoLabel: "Nomor Izin",
      onBehalf: "a.n. {name}",
      labelHolder: "Penyelenggara",
      labelValidity: "Masa Berlaku",
      labelPermitNote: "Keterangan Izin",
      licenseWord: "Izin",
      lastSyncShort: "Sinkron terakhir {ago}",

      /* ---------- 3 KARTU KEYAKINAN ---------- */
      trust1Title: "Data Registri Resmi",
      trust1Desc: "Sumber tunggal registri izin Nusuk-MUHDIN.",
      trust2Title: "Real-Time Sync",
      trust2Desc: "Status mencerminkan sinkronisasi terakhir.",
      trust3Title: "Anti-Izin Palsu",
      trust3Desc: "Lindungi jamaah dari dokumen tidak sah.",

      /* ---------- MATRIKS 13 EKOSISTEM ---------- */
      matrixEyebrow: "Integrasi Matrix",
      matrixTitle: "Matriks 13 Ekosistem × Nusuk",
      matrixSubtitle:
        "Peta cakupan layanan MUHDIN terhadap platform Nusuk — dari visa hingga pengawasan mutu, beserta tahapan ketersediaannya.",
      matrixPending: "Menyusun integrasi teknis",
      syncedLive: "Izin tersinkron live",
      svc1: "Nusuk Visa Platform",
      svc2: "Nusuk Ports & Handling",
      svc3: "Nusuk Guide Registry",
      svc4: "Mashaer & Haramain Link",
      svc5: "Nusuk Mutawif Center",
      svc6: "Nusuk e-Hotel Portal",
      svc7: "Nusuk Transport Permit",
      svc8: "Nusuk Rawdah Alternative Route",
      svc9: "Nusuk Rawdah Permit",
      svc10: "Nusuk Food License",
      svc11: "Nusuk e-Thimar Retail",
      svc12: "Nusuk One-Stop Service",
      svc13: "Nusuk Oversight Link",

      /* ---------- API BRIDGE ---------- */
      apiEyebrow: "API Bridge",
      apiTitle: "Nusuk API Bridge",
      apiSubtitle:
        "Jembatan data terbuka antara MUHDIN dan Nusuk. Endpoint publik dapat dipakai mitra untuk integrasi mandiri.",
      epPublicDesc:
        "Data Hub publik — status koneksi, metrik, ekosistem, dan aktivitas sinkronisasi.",
      epVerifyDesc:
        "Cek izin — verifikasi keaslian nomor izin Nusuk secara real-time.",
      epWebhookDesc:
        "Webhook event dari Nusuk — diverifikasi via header X-Nusuk-Signature.",
      epSyncDesc:
        "Sinkronisasi penuh izin anggota — khusus admin ekosistem.",
      authPublic: "Publik",
      authSignature: "Signature",
      authAdmin: "Admin",
      ariaEndpointList: "Daftar endpoint Nusuk API",
      curlLabel: "Contoh permintaan cURL — cek izin",
      ariaCurlExample: "Contoh perintah cURL",
      curlExample: `# Verifikasi izin Handling Clearance
curl -s "https://muhdin.web.id/api/nusuk/verify?no=NSK-HDL-2026-152220" \\
  -H "Accept: application/json"`,

      /* ---------- WEBHOOK FEED ---------- */
      feedEyebrow: "Webhook Feed",
      feedTitle: "Aktivitas Sinkronisasi Terbaru",
      feedSubtitle:
        "Jejak audit setiap event yang mengalir antara Nusuk dan registri MUHDIN — transparan dan dapat diperiksa publik.",
      feedEmpty: "Belum ada aktivitas sinkronisasi tercatat.",
      recordsAffected: "{n} record terdampak",
      logSUCCESS: "SUCCESS",
      logFAILED: "FAILED",

      /* ---------- ANGGOTA PALING PATUH ---------- */
      topEyebrow: "Compliance Leaderboard",
      topTitle: "Anggota Paling Patuh",
      topSubtitle:
        "Peringkat anggota dengan izin Nusuk aktif terbanyak dan tingkat kepatuhan sinkronisasi tertinggi.",
      ariaRank: "Peringkat {n}",
      ariaCompliance: "Kepatuhan {name}",
      activePermitsShort: "izin aktif",
      pctCompliant: "{n}% patuh",

      /* ---------- CTA ---------- */
      ctaTitle1: "Penyelenggara Anda Belum",
      ctaTitle2: "Terhubung Nusuk?",
      ctaDesc:
        "Bergabunglah dengan ekosistem MUHDIN dan nikmati sinkronisasi izin otomatis ke platform Nusuk — visa, handling, hotel, hingga Rawdah — tanpa kerumitan administrasi terpisah.",
      ctaJoin: "Gabung MUHDIN",
      ctaContact: "Hubungi Tim Integrasi",
      ariaJoin: "Gabung MUHDIN sekarang",
      ariaContactTeam: "Hubungi tim integrasi",

      /* ---------- LOADING & ERROR ---------- */
      ariaLoading: "Memuat data Nusuk Hub",
      ariaError: "Gagal memuat data",
      errorTitle: "Gagal Memuat Nusuk Hub",
      retry: "Coba Lagi",
      ariaRetry: "Coba muat ulang data Nusuk",

      /* ---------- SALIN ---------- */
      copiedTitle: "Disalin ✓",
      copiedDesc: "Teks tersalin ke clipboard.",
      copyFailedTitle: "Gagal menyalin",
      copyFailedDesc: "Clipboard tidak tersedia di peramban ini.",
      copy: "Salin",
      ariaCopy: "Salin {label} ke clipboard",
      fallbackCopyLabel: "teks",

      /* ---------- LABEL BERBASIS KODE ---------- */
      permitTypeVISA: "Visa Authorization",
      permitTypeHANDLING: "Handling Clearance",
      permitTypeMUTAWIF: "Mutawif License",
      permitTypeHOTEL: "Hotel Contract",
      permitTypeTRANSPORT: "Transport Permit",
      permitTypeRAUDAH: "Rawdah Permit",
      statusACTIVE: "AKTIF",
      statusPENDING: "PENDING",
      statusEXPIRED: "KEDALUWARSA",
      statusREJECTED: "DITOLAK",
      logTypeFULL_SYNC: "Full Sync",
      logTypeWEBHOOK: "Webhook",
      logTypeCONNECTION: "Koneksi",
      envSANDBOX: "SANDBOX",
      envPRODUCTION: "PRODUCTION",
      mtPPIU: "PPIU",
      mtPIHK: "PIHK",
      mtKBIHU: "KBIHU",
      mtIPHI: "IPHI",
      mtTRAVEL_WISATA: "Travel Wisata",
    },
  },
  en: {
    nusuk: {
      /* ---------- HERO ---------- */
      heroTitle1: "Directly Connected to the",
      heroTitle2: "Nusuk Platform",
      heroDescAuto1:
        "The official data bridge of the MUHDIN ecosystem to Nusuk — the digital platform of the Ministry of Hajj & Umrah of the Kingdom of Saudi Arabia. Automatic synchronization is running and has been recorded",
      heroDescManual1:
        "The official data bridge of the MUHDIN ecosystem to Nusuk — the digital platform of the Ministry of Hajj & Umrah of the Kingdom of Saudi Arabia. Synchronization is run manually and has been recorded",
      heroDescPost: "in the {env} environment.",
      heroLoading:
        "Fetching connection status from the Nusuk registry of the Ministry of Hajj & Umrah of the Kingdom of Saudi Arabia…",
      chipConnected: "Connected",
      chipDisconnected: "Disconnected",
      ariaConnStatus: "Nusuk connection status",
      lastSync: "Last sync: {ago}",

      /* ---------- RELATIVE TIME & DURATION ---------- */
      agoNever: "never",
      agoSec: "{n} seconds ago",
      agoMin: "{n} minutes ago",
      agoHour: "{n} hours ago",
      agoDay: "{n} days ago",
      durMs: "{n} ms",
      durSec: "{n} s",

      /* ---------- LIVE METRICS ---------- */
      metricsEyebrow: "Live Metrics",
      metricsTitle: "The Pulse of Nusuk Integration",
      metricsSubtitle:
        "Real-time figures from the MUHDIN ecosystem permit registry, synchronized with the Nusuk platform.",
      statActivePermits: "Active Permits",
      statMembersSynced: "Members Synchronized",
      statSyncSuccess: "Sync Success Rate",
      statTotalSyncs: "Total Synchronizations",
      byTypeLabel: "Permits by type",
      typeChipTitle: "{label}: {total} total, {active} active",
      typeChip: "{total} total · {active} active",
      avgLine: "Average {dur} · {n} syncs / 7 days",

      /* ---------- PERMIT CHECKER ---------- */
      checkerEyebrow: "Permit Checker",
      checkerTitle: "Verify the Authenticity of a Nusuk Permit",
      checkerSubtitle:
        "A free public tool for pilgrims and partners: enter a permit number and get its official status in an instant.",
      checkerCardTitle: "Check a Nusuk Permit",
      checkerCardDesc:
        "Verify the authenticity of permits issued through the Nusuk–MUHDIN integration.",
      checkerPlaceholder: "Example: NSK-VSA-2026-482913",
      ariaPermitNo: "Nusuk permit number",
      ariaVerifyNow: "Verify the permit number now",
      verifyNow: "Verify Now",
      checkerHint:
        "The permit number is stated on the booking confirmation issued by a MUHDIN-verified provider.",
      errEmptyNo: "Please enter a Nusuk permit number first.",
      verifyFailed: "Verification failed",
      checkedLine: "{env} · checked {ago}",
      permitNoLabel: "Permit Number",
      onBehalf: "Issued for {name}",
      labelHolder: "Provider",
      labelValidity: "Validity Period",
      labelPermitNote: "Permit Notes",
      licenseWord: "License",
      lastSyncShort: "Last synchronized {ago}",

      /* ---------- 3 TRUST CARDS ---------- */
      trust1Title: "Official Registry Data",
      trust1Desc: "The single source of the Nusuk–MUHDIN permit registry.",
      trust2Title: "Real-Time Sync",
      trust2Desc: "The status reflects the latest synchronization.",
      trust3Title: "Anti-Forged Permits",
      trust3Desc: "Protect pilgrims from unauthorized documents.",

      /* ---------- 13-ECOSYSTEM MATRIX ---------- */
      matrixEyebrow: "Integration Matrix",
      matrixTitle: "The 13 Ecosystems × Nusuk Matrix",
      matrixSubtitle:
        "A map of MUHDIN service coverage against the Nusuk platform — from visas to quality oversight, along with each availability stage.",
      matrixPending: "Technical integration in preparation",
      syncedLive: "Permits synced live",
      svc1: "Nusuk Visa Platform",
      svc2: "Nusuk Ports & Handling",
      svc3: "Nusuk Guide Registry",
      svc4: "Mashaer & Haramain Link",
      svc5: "Nusuk Mutawif Center",
      svc6: "Nusuk e-Hotel Portal",
      svc7: "Nusuk Transport Permit",
      svc8: "Nusuk Rawdah Alternative Route",
      svc9: "Nusuk Rawdah Permit",
      svc10: "Nusuk Food License",
      svc11: "Nusuk e-Thimar Retail",
      svc12: "Nusuk One-Stop Service",
      svc13: "Nusuk Oversight Link",

      /* ---------- API BRIDGE ---------- */
      apiEyebrow: "API Bridge",
      apiTitle: "Nusuk API Bridge",
      apiSubtitle:
        "An open data bridge between MUHDIN and Nusuk. Public endpoints can be used by partners for self-service integration.",
      epPublicDesc:
        "Public Hub data — connection status, metrics, ecosystems, and synchronization activity.",
      epVerifyDesc:
        "Permit check — verify the authenticity of a Nusuk permit number in real time.",
      epWebhookDesc:
        "Webhook events from Nusuk — verified via the X-Nusuk-Signature header.",
      epSyncDesc:
        "Full synchronization of member permits — ecosystem administrators only.",
      authPublic: "Public",
      authSignature: "Signature",
      authAdmin: "Admin",
      ariaEndpointList: "Nusuk API endpoint list",
      curlLabel: "Sample cURL request — permit check",
      ariaCurlExample: "Sample cURL command",
      curlExample: `# Verify a Handling Clearance permit
curl -s "https://muhdin.web.id/api/nusuk/verify?no=NSK-HDL-2026-152220" \\
  -H "Accept: application/json"`,

      /* ---------- WEBHOOK FEED ---------- */
      feedEyebrow: "Webhook Feed",
      feedTitle: "Latest Synchronization Activity",
      feedSubtitle:
        "An audit trail of every event flowing between Nusuk and the MUHDIN registry — transparent and publicly verifiable.",
      feedEmpty: "No synchronization activity recorded yet.",
      recordsAffected: "{n} records affected",
      logSUCCESS: "SUCCESS",
      logFAILED: "FAILED",

      /* ---------- MOST COMPLIANT MEMBERS ---------- */
      topEyebrow: "Compliance Leaderboard",
      topTitle: "Most Compliant Members",
      topSubtitle:
        "Ranking of members with the most active Nusuk permits and the highest synchronization compliance rate.",
      ariaRank: "Rank {n}",
      ariaCompliance: "Compliance of {name}",
      activePermitsShort: "active permits",
      pctCompliant: "{n}% compliant",

      /* ---------- CTA ---------- */
      ctaTitle1: "Your Provider Is Not Yet",
      ctaTitle2: "Connected to Nusuk?",
      ctaDesc:
        "Join the MUHDIN ecosystem and enjoy automatic permit synchronization to the Nusuk platform — visas, handling, hotels, through to Rawdah — without the hassle of separate administration.",
      ctaJoin: "Join MUHDIN",
      ctaContact: "Contact the Integration Team",
      ariaJoin: "Join MUHDIN now",
      ariaContactTeam: "Contact the integration team",

      /* ---------- LOADING & ERROR ---------- */
      ariaLoading: "Loading Nusuk Hub data",
      ariaError: "Failed to load data",
      errorTitle: "Failed to Load Nusuk Hub",
      retry: "Try Again",
      ariaRetry: "Retry loading Nusuk data",

      /* ---------- COPY ---------- */
      copiedTitle: "Copied ✓",
      copiedDesc: "Text copied to the clipboard.",
      copyFailedTitle: "Failed to copy",
      copyFailedDesc: "The clipboard is not available in this browser.",
      copy: "Copy",
      ariaCopy: "Copy {label} to clipboard",
      fallbackCopyLabel: "text",

      /* ---------- CODE-BASED LABELS ---------- */
      permitTypeVISA: "Visa Authorization",
      permitTypeHANDLING: "Handling Clearance",
      permitTypeMUTAWIF: "Mutawif License",
      permitTypeHOTEL: "Hotel Contract",
      permitTypeTRANSPORT: "Transport Permit",
      permitTypeRAUDAH: "Rawdah Permit",
      statusACTIVE: "ACTIVE",
      statusPENDING: "PENDING",
      statusEXPIRED: "EXPIRED",
      statusREJECTED: "REJECTED",
      logTypeFULL_SYNC: "Full Sync",
      logTypeWEBHOOK: "Webhook",
      logTypeCONNECTION: "Connection",
      envSANDBOX: "Sandbox",
      envPRODUCTION: "Production",
      mtPPIU: "PPIU",
      mtPIHK: "PIHK",
      mtKBIHU: "KBIHU",
      mtIPHI: "IPHI",
      mtTRAVEL_WISATA: "Travel & Tour",
    },
  },
  ar: {
    nusuk: {
      /* ---------- البطل ---------- */
      heroTitle1: "اتصال مباشر مع",
      heroTitle2: "منصة نوسك",
      heroDescAuto1:
        "الجسر الرسمي لبيانات منظومة موهدين إلى نوسك — المنصة الرقمية لوزارة الحج والعمرة في المملكة العربية السعودية. تعمل المزامنة تلقائيا وقد سجلناها",
      heroDescManual1:
        "الجسر الرسمي لبيانات منظومة موهدين إلى نوسك — المنصة الرقمية لوزارة الحج والعمرة في المملكة العربية السعودية. يتم تنفيذ المزامنة يدويا وقد سجلناها",
      heroDescPost: "في بيئة {env}.",
      heroLoading:
        "جارٍ جلب حالة الاتصال من سجل نوسك في وزارة الحج والعمرة بالمملكة العربية السعودية…",
      chipConnected: "متصل",
      chipDisconnected: "غير متصل",
      ariaConnStatus: "حالة الاتصال بنوسك",
      lastSync: "آخر مزامنة: {ago}",

      /* ---------- الوقت النسبي والمدة ---------- */
      agoNever: "أبدا",
      agoSec: "قبل {n} ثانية",
      agoMin: "قبل {n} دقيقة",
      agoHour: "قبل {n} ساعة",
      agoDay: "قبل {n} يوم",
      durMs: "{n} مللي ثانية",
      durSec: "{n} ث",

      /* ---------- المؤشرات الحية ---------- */
      metricsEyebrow: "مؤشرات حية",
      metricsTitle: "نبض التكامل مع نوسك",
      metricsSubtitle:
        "أرقام فورية من سجل تراخيص منظومة موهدين المتزامن مع منصة نوسك.",
      statActivePermits: "التراخيص النشطة",
      statMembersSynced: "الأعضاء المتزامنون",
      statSyncSuccess: "معدل نجاح المزامنة",
      statTotalSyncs: "إجمالي المزامنات",
      byTypeLabel: "التراخيص حسب النوع",
      typeChipTitle: "{label}: {total} إجمالا، {active} نشط",
      typeChip: "{total} إجمالا · {active} نشط",
      avgLine: "المتوسط {dur} · {n} مزامنة / 7 أيام",

      /* ---------- مدقق التراخيص ---------- */
      checkerEyebrow: "مدقق التراخيص",
      checkerTitle: "تحقق من صحة ترخيص نوسك",
      checkerSubtitle:
        "أداة عامة مجانية للحجاج والشركاء: أدخل رقم الترخيص واحصل على حالته الرسمية في لحظات.",
      checkerCardTitle: "التحقق من ترخيص نوسك",
      checkerCardDesc:
        "تحقق من صحة التراخيص الصادرة عبر التكامل بين نوسك وموهدين.",
      checkerPlaceholder: "مثال: NSK-VSA-2026-482913",
      ariaPermitNo: "رقم ترخيص نوسك",
      ariaVerifyNow: "التحقق من رقم الترخيص الآن",
      verifyNow: "تحقق الآن",
      checkerHint:
        "رقم الترخيص مدرج في إثبات الحجز الصادر من منظم معتمد من موهدين.",
      errEmptyNo: "الرجاء إدخال رقم ترخيص نوسك أولا.",
      verifyFailed: "فشل التحقق",
      checkedLine: "{env} · تم التحقق {ago}",
      permitNoLabel: "رقم الترخيص",
      onBehalf: "باسم {name}",
      labelHolder: "المنظم",
      labelValidity: "فترة الصلاحية",
      labelPermitNote: "ملاحظات الترخيص",
      licenseWord: "ترخيص",
      lastSyncShort: "آخر مزامنة {ago}",

      /* ---------- بطاقات الثقة الثلاث ---------- */
      trust1Title: "بيانات السجل الرسمي",
      trust1Desc: "المصدر الوحيد لسجل تراخيص نوسك وموهدين.",
      trust2Title: "مزامنة فورية",
      trust2Desc: "تعكس الحالة آخر عملية مزامنة.",
      trust3Title: "ضد التراخيص المزورة",
      trust3Desc: "حماية الحجاج من المستندات غير النظامية.",

      /* ---------- مصفوفة 13 منظومة ---------- */
      matrixEyebrow: "مصفوفة التكامل",
      matrixTitle: "مصفوفة 13 منظومة × نوسك",
      matrixSubtitle:
        "خريطة تغطية خدمات موهدين لمنصة نوسك — من التأشيرات إلى الإشراف على الجودة، مع مراحل التوافر.",
      matrixPending: "جارٍ إعداد التكامل التقني",
      syncedLive: "تراخيص متزامنة مباشرة",
      svc1: "منصة نوسك للتأشيرات",
      svc2: "نوسك للموانئ والمناولة",
      svc3: "سجل المرشدين في نوسك",
      svc4: "ربط المشاعر والحرمين",
      svc5: "مركز المطوفين في نوسك",
      svc6: "بوابة فنادق نوسك الإلكترونية",
      svc7: "ترخيص النقل في نوسك",
      svc8: "المسار البديل للروضة في نوسك",
      svc9: "تصريح الروضة في نوسك",
      svc10: "ترخيص الأغذية في نوسك",
      svc11: "بيع الثمار الإلكتروني في نوسك",
      svc12: "خدمة النافذة الواحدة في نوسك",
      svc13: "رابط الإشراف في نوسك",

      /* ---------- الجسر البرمجي ---------- */
      apiEyebrow: "الجسر البرمجي",
      apiTitle: "الجسر البرمجي لنوسك",
      apiSubtitle:
        "جسر بيانات مفتوح بين موهدين ونوسك. يمكن للشركاء استخدام نقاط النهاية العامة للتكامل الذاتي.",
      epPublicDesc:
        "بيانات المركز العام — حالة الاتصال والمؤشرات والمنظومات ونشاط المزامنة.",
      epVerifyDesc:
        "التحقق من الترخيص — التحقق من صحة رقم ترخيص نوسك فوريا.",
      epWebhookDesc:
        "أحداث ويبهوك من نوسك — يتم التحقق منها عبر ترويسة X-Nusuk-Signature.",
      epSyncDesc:
        "مزامنة كاملة لتراخيص الأعضاء — لمدراء المنظومة فقط.",
      authPublic: "عام",
      authSignature: "توقيع",
      authAdmin: "المدير",
      ariaEndpointList: "قائمة نقاط نهاية واجهة نوسك البرمجية",
      curlLabel: "مثال طلب cURL — التحقق من الترخيص",
      ariaCurlExample: "مثال أمر cURL",
      curlExample: `# التحقق من ترخيص المناولة
curl -s "https://muhdin.web.id/api/nusuk/verify?no=NSK-HDL-2026-152220" \\
  -H "Accept: application/json"`,

      /* ---------- بث الأحداث ---------- */
      feedEyebrow: "بث الأحداث",
      feedTitle: "أحدث نشاطات المزامنة",
      feedSubtitle:
        "سجل تدقيق لكل حدث يتدفق بين نوسك وسجل موهدين — شفاف وقابل للفحص من الجمهور.",
      feedEmpty: "لم يسجل أي نشاط مزامنة بعد.",
      recordsAffected: "تأثر {n} من السجلات",
      logSUCCESS: "ناجحة",
      logFAILED: "فاشلة",

      /* ---------- الأعضاء الأكثر التزاما ---------- */
      topEyebrow: "لوحة صدارة الالتزام",
      topTitle: "الأعضاء الأكثر التزاما",
      topSubtitle:
        "ترتيب الأعضاء الأكثر امتلاكا للتراخيص النشطة في نوسك وأعلى معدل التزام بالمزامنة.",
      ariaRank: "المرتبة {n}",
      ariaCompliance: "التزام {name}",
      activePermitsShort: "تراخيص نشطة",
      pctCompliant: "التزام {n}%",

      /* ---------- الدعوة ---------- */
      ctaTitle1: "منظمك غير متصل بعد بـ",
      ctaTitle2: "نوسك",
      ctaDesc:
        "انضم إلى منظومة موهدين واستمتع بمزامنة تلقائية للتراخيص إلى منصة نوسك — التأشيرات والمناولة والفنادق وحتى الروضة — دون تعقيدات إدارية منفصلة.",
      ctaJoin: "انضم إلى موهدين",
      ctaContact: "تواصل مع فريق التكامل",
      ariaJoin: "انضم إلى موهدين الآن",
      ariaContactTeam: "تواصل مع فريق التكامل",

      /* ---------- التحميل والخطأ ---------- */
      ariaLoading: "جارٍ تحميل بيانات مركز نوسك",
      ariaError: "فشل تحميل البيانات",
      errorTitle: "فشل تحميل مركز نوسك",
      retry: "حاول مجددا",
      ariaRetry: "أعد محاولة تحميل بيانات نوسك",

      /* ---------- النسخ ---------- */
      copiedTitle: "تم النسخ ✓",
      copiedDesc: "تم نسخ النص إلى الحافظة.",
      copyFailedTitle: "فشل النسخ",
      copyFailedDesc: "الحافظة غير متوفرة في هذا المتصفح.",
      copy: "نسخ",
      ariaCopy: "انسخ {label} إلى الحافظة",
      fallbackCopyLabel: "النص",

      /* ---------- تسميات حسب الرمز ---------- */
      permitTypeVISA: "إذن التأشيرة",
      permitTypeHANDLING: "إذن خدمات المناولة",
      permitTypeMUTAWIF: "ترخيص المطوف",
      permitTypeHOTEL: "عقد الفندق",
      permitTypeTRANSPORT: "ترخيص النقل",
      permitTypeRAUDAH: "تصريح الروضة",
      statusACTIVE: "نشط",
      statusPENDING: "قيد الانتظار",
      statusEXPIRED: "منتهي الصلاحية",
      statusREJECTED: "مرفوض",
      logTypeFULL_SYNC: "مزامنة كاملة",
      logTypeWEBHOOK: "ويبهوك",
      logTypeCONNECTION: "اتصال",
      envSANDBOX: "بيئة تجريبية",
      envPRODUCTION: "بيئة الإنتاج",
      mtPPIU: "PPIU",
      mtPIHK: "PIHK",
      mtKBIHU: "KBIHU",
      mtIPHI: "IPHI",
      mtTRAVEL_WISATA: "السفر والسياحة",
    },
  },
} as const;
