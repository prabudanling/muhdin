/**
 * namespace "about" — dikelola oleh agent Task 14-b.
 * Struktur wajib: { id: {...}, en: {...}, ar: {...} } — key identik di ketiganya.
 * Teks statis + konten lib/constants.ts (mitra, nilai, prinsip, KPI) dipetakan di sini.
 * Visi/misi/roadmap/management dari settings & API tidak diterjemahkan di frontend.
 */
export const aboutDict = {
  id: {
    about: {
      eyebrow: "Tentang MUHDIN",
      title: "Asosiasi di Atas Asosiasi",
      subtitle:
        "MUHDIN bukan pesaing pelaku industri — melainkan lapisan federasi yang menetapkan standar mutu, menyatukan akses Nusuk, mengelola teknologi bersama, dan mengawal kualitas layanan secara menyeluruh.",
      visionTitle: "Visi",
      visionFallback:
        "Menjadi jaringan ekosistem layanan umroh dan haji paling tepercaya, terstandar, dan terdigitalisasi dari dan menuju Indonesia pada tahun 2030.",
      missionTitle: "Lima Misi",
      missions: {
        m1: "Mengonsolidasikan penyelenggara jasa ibadah Indonesia dalam satu payung tata kelola standar mutu dan etika bersama.",
        m2: "Mengintegrasikan seluruh rantai layanan jamaah melalui platform digital real-time dengan Nusuk dan regulator.",
        m3: "Meningkatkan profesionalisme SDM ibadah melalui sertifikasi tour leader dan mutawif yang seragam.",
        m4: "Melindungi jamaah melalui transparansi harga, kepastian layanan, dan mekanisme perlindungan finansial.",
        m5: "Meningkatkan daya saing industri Indonesia dalam kemitraan dengan pemerintah dan penyedia layanan Arab Saudi.",
      },
      fedEyebrow: "Arsitektur Kelembagaan",
      fedTitle: "Prinsip Federasi: Menghubungkan, Bukan Menggantikan",
      fedSubtitle:
        "Sebagaimana IATA bagi industri penerbangan — MUHDIN menyediakan infrastruktur bersama, standar interoperabilitas, dan penjaminan mutu yang tidak efisien bila dibangun setiap pelaku secara terpisah.",
      principles: {
        p1Title: "Sertifikasi & Rating Mutu",
        p1Desc: "Dinilai dari kepatuhan operasional, kepuasan jamaah, dan integritas keuangan.",
        p2Title: "Dewan Etik & Sanksi Berjenjang",
        p2Desc: "Teguran, penghentian sementara, hingga pemberhentian keanggotaan dan pelaporan regulator.",
        p3Title: "Audit Mutu Berkala",
        p3Desc: "Hasil audit terintegrasi ke dashboard monitoring dan menjadi dasar peringkat publik.",
      },
      partners: {
        PPIU: "Perusahaan Perjalanan Ibadah Umrah",
        PIHK: "Penyelenggara Perjalanan Ibadah Haji Khusus",
        KBIHU: "Konsorsium Biro Perjalanan Ibadah Haji",
        IPHI: "Ikatan Persaudaraan Haji Indonesia",
        TW: "Penyelenggara Perjalanan Wisata Halal & Ziarah",
      },
      valuesEyebrow: "Nilai Utama",
      valuesTitle: "Lima Nilai, Satu Standar Kerja",
      values: {
        Amanah: {
          name: "Amanah",
          meaning:
            "Menepati janji layanan, menjaga dana jamaah dengan tata kelola yang dapat diaudit, dan menempatkan kepentingan jamaah di atas kepentingan sesaat.",
        },
        Profesional: {
          name: "Profesional",
          meaning:
            "Seluruh tenaga dan mitra bersertifikasi dengan kompetensi terukur, prosedur baku, dan penilaian mutu berkala.",
        },
        Terintegrasi: {
          name: "Terintegrasi",
          meaning:
            "Satu data dan satu alur layanan dari registrasi hingga kepulangan, tersambung secara real time antar mitra.",
        },
        Transparan: {
          name: "Transparan",
          meaning:
            "Harga, cakupan layanan, status kuota, dan rekam jejak penyelenggara terbuka bagi jamaah dan regulator.",
        },
        Tepercaya: {
          name: "Tepercaya",
          meaning:
            "Legalitas dan rekam jejak mitra diverifikasi, sanksi ditegakkan secara konsisten, dan mutu diaudit secara berkala.",
        },
      },
      mgmtEyebrow: "Struktur Organisasi",
      mgmtTitle: "Dewan Pengurus MUHDIN",
      mgmtSubtitle: "Kepengurusan yang berintegritas memastikan standar ekosistem ditegakkan secara konsisten.",
      org: {
        pp: "Pengurus Pusat",
        ppFull: "Pimpinan tertinggi MUHDIN di tingkat nasional",
        appoint: "Penunjukan",
        bakorwil: "Bakorwil Provinsi",
        bakorwilFull: "Badan Koordinator Wilayah Provinsi",
        bakorcab: "Bakorcab Kab/Kota",
        bakorcabFull: "Badan Koordinasi Kabupaten/Kota",
        note: "Bakorwil dan Bakorcab diangkat melalui penunjukan oleh Pengurus Pusat.",
      },
      roadmapEyebrow: "Peta Jalan 2026-2030",
      roadmapTitle: "Implementasi Bertahap Berbasis Bukti",
      deliverablesLabel: "Deliverables Kunci",
      kpi: {
        title: "Indikator Keberhasilan 2030",
        subtitle:
          "Dilaporkan tahunan kepada Dewan Pengurus dan regulator — ambisius, terukur, dan dikalibrasi bersama asosiasi mitra.",
        colIndicator: "Indikator",
        colBaseline: "Baseline 2026",
        colTarget: "Target 2030",
        rows: {
          r1: { indicator: "Jamaah terlayani kanal terverifikasi", baseline: "Pilot 50.000", target: "1.000.000+ / tahun" },
          r2: { indicator: "Mitra aktif bersertifikasi", baseline: "100 anggota pendiri", target: "1.000+ penyelenggara" },
          r3: { indicator: "Rasio jamaah terlacak GPS real time", baseline: "60%", target: "100%" },
          r4: { indicator: "Kepuasan jamaah (NPS)", baseline: "Min. 40", target: "Min. 70" },
          r5: { indicator: "Insiden penipuan anggota", baseline: "0", target: "0 (nol toleransi)" },
          r6: { indicator: "SLA handling keberangkatan tepat waktu", baseline: "Min. 90%", target: "Min. 98%" },
          r7: { indicator: "SDM ibadah bersertifikasi", baseline: "1.000 orang", target: "10.000 orang" },
        },
      },
      cta: "Bergabung Bersama MUHDIN",
    },
  },
  en: {
    about: {
      eyebrow: "About MUHDIN",
      title: "An Association Above Associations",
      subtitle:
        "MUHDIN is not a competitor to industry players — it is a federation layer that sets quality standards, unifies Nusuk access, manages shared technology, and safeguards service quality end to end.",
      visionTitle: "Vision",
      visionFallback:
        "To become the most trusted, standardized, and digitalized ecosystem network for Umrah and Hajj services from and toward Indonesia by 2030.",
      missionTitle: "Five Missions",
      missions: {
        m1: "Consolidate Indonesian pilgrimage service providers under one governance umbrella of shared quality standards and ethics.",
        m2: "Integrate the entire pilgrim service chain through a real-time digital platform connected with Nusuk and regulators.",
        m3: "Raise the professionalism of pilgrimage personnel through uniform certification of tour leaders and mutawif.",
        m4: "Protect pilgrims through price transparency, service certainty, and financial protection mechanisms.",
        m5: "Enhance the competitiveness of Indonesia's industry in partnership with the government and service providers in Saudi Arabia.",
      },
      fedEyebrow: "Institutional Architecture",
      fedTitle: "The Federation Principle: Connecting, Not Replacing",
      fedSubtitle:
        "As IATA is to the airline industry — MUHDIN provides shared infrastructure, interoperability standards, and quality assurance that would be inefficient to build separately for every player.",
      principles: {
        p1Title: "Certification & Quality Rating",
        p1Desc: "Rated on operational compliance, pilgrim satisfaction, and financial integrity.",
        p2Title: "Ethics Council & Graduated Sanctions",
        p2Desc: "From warnings and temporary suspension to termination of membership and reporting to regulators.",
        p3Title: "Periodic Quality Audit",
        p3Desc: "Audit results feed into the monitoring dashboard and form the basis of public rankings.",
      },
      partners: {
        PPIU: "Umrah Travel Service Company",
        PIHK: "Organizer of Special Hajj Travel Services",
        KBIHU: "Consortium of Hajj Travel Bureaus",
        IPHI: "Indonesian Hajj Brotherhood Association",
        TW: "Halal & Ziarah Tour Operator",
      },
      valuesEyebrow: "Core Values",
      valuesTitle: "Five Values, One Standard of Work",
      values: {
        Amanah: {
          name: "Trustworthy",
          meaning:
            "Fulfilling service promises, safeguarding pilgrim funds with auditable governance, and placing the pilgrims' interests above momentary ones.",
        },
        Profesional: {
          name: "Professional",
          meaning:
            "All staff and partners are certified with measurable competence, standard procedures, and periodic quality assessments.",
        },
        Terintegrasi: {
          name: "Integrated",
          meaning:
            "One data set and one service flow from registration to departure, connected in real time across partners.",
        },
        Transparan: {
          name: "Transparent",
          meaning:
            "Prices, service scope, quota status, and provider track records are open to pilgrims and regulators.",
        },
        Tepercaya: {
          name: "Trusted",
          meaning:
            "Partner legality and track records are verified, sanctions are consistently enforced, and quality is audited periodically.",
        },
      },
      mgmtEyebrow: "Organizational Structure",
      mgmtTitle: "The MUHDIN Board",
      mgmtSubtitle: "A management team of integrity ensures ecosystem standards are consistently upheld.",
      org: {
        pp: "Central Board",
        ppFull: "MUHDIN's highest national leadership",
        appoint: "Appointed",
        bakorwil: "Provincial Bakorwil",
        bakorwilFull: "Provincial Regional Coordinating Board",
        bakorcab: "Regency/City Bakorcab",
        bakorcabFull: "Branch Coordinating Board (Regency/City)",
        note: "Bakorwil and Bakorcab are appointed by the Central Board.",
      },
      roadmapEyebrow: "Roadmap 2026-2030",
      roadmapTitle: "Evidence-Based Phased Implementation",
      deliverablesLabel: "Key Deliverables",
      kpi: {
        title: "2030 Success Indicators",
        subtitle:
          "Reported annually to the Board and regulators — ambitious, measurable, and calibrated together with partner associations.",
        colIndicator: "Indicator",
        colBaseline: "2026 Baseline",
        colTarget: "2030 Target",
        rows: {
          r1: { indicator: "Pilgrims served through verified channels", baseline: "Pilot 50,000", target: "1,000,000+ / year" },
          r2: { indicator: "Active certified partners", baseline: "100 founding members", target: "1,000+ providers" },
          r3: { indicator: "Real-time GPS-tracked pilgrim ratio", baseline: "60%", target: "100%" },
          r4: { indicator: "Pilgrim satisfaction (NPS)", baseline: "Min. 40", target: "Min. 70" },
          r5: { indicator: "Fraud incidents by members", baseline: "0", target: "0 (zero tolerance)" },
          r6: { indicator: "On-time departure handling SLA", baseline: "Min. 90%", target: "Min. 98%" },
          r7: { indicator: "Certified pilgrimage personnel", baseline: "1,000 people", target: "10,000 people" },
        },
      },
      cta: "Join Together with MUHDIN",
    },
  },
  ar: {
    about: {
      eyebrow: "عن مُهدين",
      title: "اتحاد فوق الاتحادات",
      subtitle:
        "مُهدين ليس منافساً لفاعلي القطاع — بل طبقة اتحادية تضع معايير الجودة، وتوحّد الوصول إلى نوسك، وتدير التقنية المشتركة، وتراقب جودة الخدمة من بدايتها إلى نهايتها.",
      visionTitle: "الرؤية",
      visionFallback:
        "أن نصبح شبكة منظومات خدمات العمرة والحج الأكثر موثوقية وتوحيماً ورقمنةً، من إندونيسيا وإليها، بحلول عام 2030.",
      missionTitle: "خمس رسالات",
      missions: {
        m1: "توحيد منظمي خدمات العبادة في إندونيسيا تحت مظلة حوكمة واحدة لمعايير الجودة والأخلاق المشتركة.",
        m2: "تكامل سلسلة خدمات الحجاج بالكامل عبر منصة رقمية لحظية متصلة بنوسك والجهات التنظيمية.",
        m3: "رفع مستوى احترافية الكوادر العبادية من خلال توحيد اعتماد قادة الرحلات والمطوِّفين.",
        m4: "حماية الحجاج من خلال شفافية الأسعار وضمان الخدمة وآليات الحماية المالية.",
        m5: "تعزيز تنافسية القطاع الإندونيسي في شراكة مع الحكومة ومقدمي الخدمات في المملكة العربية السعودية.",
      },
      fedEyebrow: "البنية المؤسسية",
      fedTitle: "مبدأ الاتحاد: الربط لا الإحلال",
      fedSubtitle:
        "كما أن إياتا بالنسبة لصناعة الطيران — توفر مُهدين بنية تحتية مشتركة ومعايير قابلية للتشغيل البيني وضماناً للجودة، وهو ما لا يكون بناؤه من كل فاعل على حدة مجدياً.",
      principles: {
        p1Title: "الاعتماد وتصنيف الجودة",
        p1Desc: "يُقيَّم الأعضاء وفق الالتزام التشغيلي ورضا الحجاج والسلامة المالية.",
        p2Title: "مجلس الأخلاقيات والعقوبات المتدرجة",
        p2Desc: "من الإنذار والإيقاف المؤقت إلى إنهاء العضوية والإبلاغ للجهات التنظيمية.",
        p3Title: "تدقيق دوري للجودة",
        p3Desc: "تُدمج نتائج التدقيق في لوحة المراقبة وتشكل أساس التصنيف العام.",
      },
      partners: {
        PPIU: "شركة خدمات الرحلات العمرة",
        PIHK: "منظم الرحلات الحجية الخاصة",
        KBIHU: "اتحاد مكاتب رحلات الحج",
        IPHI: "رابطة الأخوة الحجية الإندونيسية",
        TW: "منظم الرحلات الحلال والزيارة",
      },
      valuesEyebrow: "القيم الأساسية",
      valuesTitle: "خمس قيم، معيار عمل واحد",
      values: {
        Amanah: {
          name: "الأمانة",
          meaning: "الوفاء بوعود الخدمة، وحفظ أموال الحجاج بحوكمة قابلة للتدقيق، وتقديم مصلحة الحجاج على المصالح اللحظية.",
        },
        Profesional: {
          name: "الاحترافية",
          meaning: "جميع الكوادر والشركاء حاصلون على الاعتماد بكفاءة قابلة للقياس وإجراءات موحدة وتقييم دوري للجودة.",
        },
        Terintegrasi: {
          name: "التكامل",
          meaning: "بيانات واحدة ومسار خدمة واحد من التسجيل حتى العودة، متصلة لحظياً بين الشركاء.",
        },
        Transparan: {
          name: "الشفافية",
          meaning: "الأسعار ونطاق الخدمة وحالة الحصص وسجل مقدمي الخدمة متاحة أمام الحجاج والجهات التنظيمية.",
        },
        Tepercaya: {
          name: "الموثوقية",
          meaning: "الجدارة القانونية وسجل أداء الشركاء موثقة، والعقوبات مطبقة بثبات، والجودة تخضع للتدقيق دورياً.",
        },
      },
      mgmtEyebrow: "الهيكل التنظيمي",
      mgmtTitle: "مجلس إدارة مُهدين",
      mgmtSubtitle: "إدارة راسخة النزاهة تضمن تطبيق معايير المنظومة بثبات.",
      org: {
        pp: "المجلس المركزي",
        ppFull: "الهيئة القيادية العليا لمنظمة مهدين على المستوى الوطني",
        appoint: "بالتعيين",
        bakorwil: "مجلس التنسيق الإقليمي للمقاطعة",
        bakorwilFull: "هيئة التنسيق الإقليمية على مستوى المقاطعة",
        bakorcab: "مجلس التنسيق الفرعي للمناطق والمدن",
        bakorcabFull: "هيئة التنسيق على مستوى الوحدة الإدارية/المدينة",
        note: "يتم تعيين مجلسي التنسيق الإقليمي والفرعي من قبل المجلس المركزي.",
      },
      roadmapEyebrow: "خارطة الطريق 2026-2030",
      roadmapTitle: "تنفيذ مرحلي قائم على الأدلة",
      deliverablesLabel: "المخرجات الرئيسية",
      kpi: {
        title: "مؤشرات النجاح لعام 2030",
        subtitle: "يُرفع تقرير سنوي إلى مجلس الإدارة والجهات التنظيمية — طموح وقابل للقياس ويُعايَر بالتشاور مع الاتحادات الشريكة.",
        colIndicator: "المؤشر",
        colBaseline: "خط الأساس 2026",
        colTarget: "مستهدف 2030",
        rows: {
          r1: { indicator: "الحجاج المخدومون عبر القنوات الموثقة", baseline: "تجريبي 50,000", target: "أكثر من مليون / سنوياً" },
          r2: { indicator: "الشركاء النشطون المعتمدون", baseline: "100 عضو مؤسس", target: "أكثر من 1,000 منظمة" },
          r3: { indicator: "نسبة الحجاج المتتبعين عبر GPS لحظياً", baseline: "60%", target: "100%" },
          r4: { indicator: "رضا الحجاج (NPS)", baseline: "40 على الأقل", target: "70 على الأقل" },
          r5: { indicator: "حالات احتيال من الأعضاء", baseline: "0", target: "0 (لا تسامح مطلقاً)" },
          r6: { indicator: "اتفاقية مستوى الخدمة لانطلاقات في موعدها", baseline: "90% على الأقل", target: "98% على الأقل" },
          r7: { indicator: "الكوادر العبادية المعتمدة", baseline: "1,000 شخص", target: "10,000 شخص" },
        },
      },
      cta: "انضم إلى صفوف مُهدين",
    },
  },
} as const;
