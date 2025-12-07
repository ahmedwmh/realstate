"use client";

import React from "react";
import styles from "./hero.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import Curtain from "@/components/curtain";

interface HeroSlide {
  id: number;
  order: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  mainImage: string;
  contentImage: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export default function Hero() {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const [heroSlides, setHeroSlides] = React.useState<HeroSlide[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = React.useState<Set<string>>(new Set());

  // Preload images for better performance
  const preloadImages = React.useCallback((slides: HeroSlide[]) => {
    const imageUrls = new Set<string>();
    slides.forEach((slide) => {
      imageUrls.add(slide.mainImage);
      imageUrls.add(slide.contentImage);
    });

    const loadedSet = new Set<string>();
    let loadedCount = 0;
    const totalImages = imageUrls.size;

    imageUrls.forEach((url) => {
      const img = new window.Image();
      img.onload = () => {
        loadedSet.add(url);
        loadedCount++;
        setImagesLoaded(new Set(loadedSet));
        
        // If all images are loaded, we can hide loading
        if (loadedCount === totalImages) {
          // Small delay to ensure smooth transition
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }
      };
      img.onerror = () => {
        loadedSet.add(url); // Mark as "attempted" even if failed
        loadedCount++;
        setImagesLoaded(new Set(loadedSet));
        if (loadedCount === totalImages) {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        }
      };
      img.src = url;
    });

    // Fallback: if images take too long, hide loading after 5 seconds
    setTimeout(() => {
      if (loadedCount < totalImages) {
        setLoading(false);
      }
    }, 5000);
  }, []);

  const fetchHeroSlides = React.useCallback(async (retryCount = 0): Promise<void> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("/api/hero", {
        signal: controller.signal,
        cache: "force-cache" // Use cached data when available
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const sortedSlides = Array.isArray(data) 
        ? data.sort((a: HeroSlide, b: HeroSlide) => a.order - b.order)
        : [];

      if (sortedSlides.length === 0) {
        throw new Error("No hero slides found");
      }

      setHeroSlides(sortedSlides);
      setError(null);
      
      // Preload images - loading will be set to false when images are loaded
      preloadImages(sortedSlides);
      
      // Fallback: if no images to preload, hide loading immediately
      if (sortedSlides.length === 0 || sortedSlides.every(slide => !slide.mainImage && !slide.contentImage)) {
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error fetching hero slides:", error);
      
      // Retry logic
      if (retryCount < MAX_RETRIES && !error.name?.includes('abort')) {
        setTimeout(() => {
          fetchHeroSlides(retryCount + 1);
        }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      } else {
        setError("Failed to load hero slides. Please refresh the page.");
        setLoading(false);
      }
    }
  }, [preloadImages]);

  // Fetch hero data on mount
  React.useEffect(() => {
    fetchHeroSlides();
  }, [fetchHeroSlides]);

  React.useEffect(() => {
    if (!isAutoPlaying || heroSlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroSlides.length]);

  const goToSlide = React.useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  }, []);

  const handlePrevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  }, [heroSlides.length]);

  const handleNextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  }, [heroSlides.length]);

  // Memoize current slide data
  const currentSlideData = React.useMemo(() => {
    return heroSlides[currentSlide];
  }, [heroSlides, currentSlide]);

  const title = React.useMemo(() => {
    return currentSlideData 
      ? (language === "ar" ? currentSlideData.titleAr : currentSlideData.titleEn)
      : "";
  }, [currentSlideData, language]);

  const description = React.useMemo(() => {
    return currentSlideData
      ? (language === "ar" ? currentSlideData.descriptionAr : currentSlideData.descriptionEn)
      : "";
  }, [currentSlideData, language]);

  // Show loading skeleton while fetching or loading images
  if (loading || heroSlides.length === 0) {
    return (
      <section className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.heroWrapper}>
            {/* Left Side - Image Slider Skeleton */}
            <div className={styles.sliderContainer}>
              <div className={styles.slider}>
                <div className={styles.skeletonImage} />
              </div>
            </div>

            {/* Right Side - Content Skeleton */}
            <div className={styles.contentContainer}>
              <div className={styles.content}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDescription} />
                <div className={styles.skeletonDescription} style={{ width: "80%" }} />
                <div className={styles.contentImage}>
                  <div className={styles.skeletonImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className={styles.errorMessage}>
            <p>{error}</p>
            <button onClick={() => {
              setError(null);
              setLoading(true);
              fetchHeroSlides();
            }}>
              Retry
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.heroWrapper}>
          {/* Left Side - Image Slider */}
          <div className={styles.sliderContainer}>
            <div className={styles.slider}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={styles.sliderImage}
                >
                  <Image
                    src={currentSlideData.mainImage}
                    alt={title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={currentSlide === 0}
                    unoptimized={currentSlideData.mainImage.startsWith("http")}
                    loading={currentSlide === 0 ? "eager" : "lazy"}
                    quality={90}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slider Navigation Dots */}
              <div className={styles.sliderDots}>
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={cn(styles.dot, {
                      [styles.dotActive]: index === currentSlide,
                    })}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Slider Navigation Arrows */}
              <button
                className={cn(styles.arrow, styles.arrowLeft)}
                onClick={handlePrevSlide}
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                className={cn(styles.arrow, styles.arrowRight)}
                onClick={handleNextSlide}
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={styles.contentContainer}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={styles.content}
              >
                <Heading type="heading-1" className={styles.title}>
                  {title}
                </Heading>

                <p className={cn("paragraph-large", styles.description)}>
                  {description}
                </p>

                <div className={styles.contentImage}>
                  <Image
                    src={currentSlideData.contentImage}
                    alt={title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized={currentSlideData.contentImage.startsWith("http")}
                    loading="lazy"
                    quality={85}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
