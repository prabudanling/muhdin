// Shared client-side types mirroring Prisma models

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover: string | null;
  status: string;
  featured: boolean;
  views: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ecosystem {
  id: string;
  number: number;
  name: string;
  cluster: string;
  scope: string;
  standard: string;
  icon: string;
  color: string;
  description: string;
  image: string | null;
}

export interface JourneyStep {
  id: string;
  step: number;
  title: string;
  activity: string;
  actor: string;
  output: string;
  icon: string;
}

export interface Roadmap {
  id: string;
  phase: string;
  period: string;
  focus: string;
  deliverables: string;
  order: number;
}

export interface Member {
  id: string;
  name: string;
  type: string;
  city: string;
  province: string;
  licenseNo: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  rating: number;
  status: string;
  memberSince: number;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  duration: number;
  summary: string;
  content: string;
  order: number;
  published: boolean;
  views: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface MembershipApplication {
  id: string;
  orgName: string;
  type: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  licenseNo: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  published: boolean;
}

export interface ManagementMember {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  order: number;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface AdminStats {
  articles: number;
  tutorials: number;
  members: number;
  pendingMembers: number;
  unreadMessages: number;
  pendingApplications: number;
  totalViews: number;
  testimonials: number;
  faqs: number;
  byCategory: { category: string; count: number }[];
  recentMessages: ContactMessage[];
  recentApplications: MembershipApplication[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}
