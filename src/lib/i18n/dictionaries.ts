/**
 * Aggregator kamus i18n. Satu file per namespace berisi ketiga locale
 * { id, en, ar } — bebas konflik antar agent.
 */
import { commonDict } from "@/lib/i18n/locales/common";
import { navbarDict } from "@/lib/i18n/locales/navbar";
import { footerDict } from "@/lib/i18n/locales/footer";
import { homeDict } from "@/lib/i18n/locales/home";
import { miscDict } from "@/lib/i18n/locales/misc";
import { ecosystemDict } from "@/lib/i18n/locales/ecosystem";
import { journeyDict } from "@/lib/i18n/locales/journey";
import { membersDict } from "@/lib/i18n/locales/members";
import { aboutDict } from "@/lib/i18n/locales/about";
import { tutorialDict } from "@/lib/i18n/locales/tutorial";
import { newsDict } from "@/lib/i18n/locales/news";
import { contactDict } from "@/lib/i18n/locales/contact";
import { joinDict } from "@/lib/i18n/locales/join";
import { nusukDict } from "@/lib/i18n/locales/nusuk";
import { trackDict } from "@/lib/i18n/locales/track";
import { galleryDict } from "@/lib/i18n/locales/gallery";
import { agendaDict } from "@/lib/i18n/locales/agenda";
import { downloadsDict } from "@/lib/i18n/locales/downloads";
import { reportDict } from "@/lib/i18n/locales/report";

const dicts = [
  commonDict,
  navbarDict,
  footerDict,
  homeDict,
  miscDict,
  ecosystemDict,
  journeyDict,
  membersDict,
  aboutDict,
  tutorialDict,
  newsDict,
  contactDict,
  joinDict,
  nusukDict,
  trackDict,
  galleryDict,
  agendaDict,
  downloadsDict,
  reportDict,
];

export const dictionaries: Record<"id" | "en" | "ar", Record<string, unknown>> = {
  id: Object.assign({}, ...dicts.map((d) => d.id)),
  en: Object.assign({}, ...dicts.map((d) => d.en)),
  ar: Object.assign({}, ...dicts.map((d) => d.ar)),
};
