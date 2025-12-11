/**
 * Shared TypeScript types and interfaces
 * Reduces duplication across components
 */

// Project types
export interface Project {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  images: string[];
  address?: string | null;
  features?: {
    id: number;
    icon: string;
    name: string;
    value: string | number;
  }[] | null;
}

// Benefit types
export interface BenefitItem {
  id: number;
  titleEn: string;
  titleAr: string;
  order: number;
}

export interface Benefit {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  order: number;
  items: BenefitItem[];
}

// Service types
export interface Service {
  id: number;
  icon: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  order: number;
}

// Fact types
export interface Fact {
  id: number;
  icon: string;
  title: string;
  descriptionEn: string;
  descriptionAr: string;
  order: number;
}

// Showcase types
export interface Showcase {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  thumbnailImage: string;
  videoUrl: string;
}

// Hero slide types
export interface HeroSlide {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  mainImage: string;
  contentImage: string;
  order: number;
}

// News types
export interface News {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  createdAt: string;
}

