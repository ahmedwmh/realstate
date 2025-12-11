"use client";

import React, { useMemo } from "react";
import styles from "./benefits.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import Image from "next/image";
import { Checkmark } from "@/constants/icons";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { Benefit } from "@/types";

// Stable transform function to prevent re-renders
const transformBenefits = (data: any): Benefit[] => {
  return Array.isArray(data) ? data : [];
};

function Benefits() {
  const { language } = useLanguage();
  const { data: benefitsData, loading } = useApiFetch<Benefit[]>({
    endpoint: "/api/benefits",
    cache: "no-store",
    transform: transformBenefits,
  });

  // Ensure benefits is always an array - must be called before any conditional returns
  const benefits = useMemo(() => {
    return Array.isArray(benefitsData) ? benefitsData : [];
  }, [benefitsData]);

  // Memoize benefits for rendering - must be called before any conditional returns
  const memoizedBenefits = useMemo(() => benefits, [benefits]);

  if (loading) {
    return (
      <section className={cn("section")}>
        {[...Array(2)].map((_, index) => (
          <div key={index} className={cn("container", styles.container)}>
            <div className={styles.image}>
              <div className={styles.skeletonImage} />
            </div>
            <div className={styles.content}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonDescription} />
              <div className={styles.skeletonDescription} style={{ width: "90%" }} />
              <div className={styles.skeletonDescription} style={{ width: "70%" }} />
              <ul className={styles.list}>
                {[...Array(3)].map((_, i) => (
                  <li key={i} className={styles.item}>
                    <div className={styles.skeletonIcon} />
                    <div className={styles.skeletonText} />
                  </li>
                ))}
              </ul>
              <div className={styles.skeletonButton} />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (memoizedBenefits.length === 0) {
    return null;
  }

  return (
    <section className={cn("section")}>
      {memoizedBenefits.map((benefit) => {
        const title = language === "ar" ? benefit.titleAr : benefit.titleEn;
        const description = language === "ar" ? benefit.descriptionAr : benefit.descriptionEn;
        
        return (
        <div key={benefit.id} className={cn("container", styles.container)}>
          <div className={styles.image}>
              {benefit.image && (
            <Image
              src={benefit.image}
                  alt={title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={benefit.image?.startsWith("http") || false}
                  loading="lazy"
                />
              )}
            </div>
            <div className={styles.content}>
              <Heading type="heading-3">{title}</Heading>
              <div className={cn("paragraph-large", styles.subtitle)}>{description}</div>

            <ul className={styles.list}>
              {benefit.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.icon}>{Checkmark}</div>
                  <div className={cn("paragraph-medium", styles.text)}>
                      {language === "ar" ? item.titleAr : item.titleEn}
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/about" className={cn("button", styles.button)}>
              Learn more
            </Link>
          </div>
        </div>
        );
      })}
    </section>
  );
}

export default React.memo(Benefits);
