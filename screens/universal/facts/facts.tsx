"use client";

import React, { useMemo, useCallback } from "react";
import styles from "./facts.module.css";
import cn from "classnames";
import { Building, HappyHeart, Medal } from "@/constants/icons";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { Fact } from "@/types";
import * as Icons from "@/constants/icons";

const iconMap: Record<string, React.ReactNode> = {
  HappyHeart,
  Building,
  Medal,
};

// Stable transform function to prevent re-renders
const transformFacts = (data: any): Fact[] => {
  return Array.isArray(data) ? data : [];
};

function Facts() {
  const { language } = useLanguage();
  const { data: factsData, loading } = useApiFetch<Fact[]>({
    endpoint: "/api/facts",
    cache: "no-store",
    transform: transformFacts,
  });

  // Ensure facts is always an array - must be called before any conditional returns
  const facts = useMemo(() => {
    return Array.isArray(factsData) ? factsData : [];
  }, [factsData]);

  // Memoize facts for rendering - must be called before any conditional returns
  const memoizedFacts = useMemo(() => facts, [facts]);

  const getIcon = useCallback((iconName: string) => {
    if (iconMap[iconName]) {
      return iconMap[iconName];
    }
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  }, []);

  if (loading) {
    return (
      <section className={cn("section")}>
        <div className={cn("container")}>
          <div className={cn("subheading-small", styles.title)}>Facts</div>
          <div className={styles.facts}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.fact}>
                <div className={styles.skeletonIcon} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDescription}>
                  <div className={styles.skeletonDescriptionLine} />
                  <div className={styles.skeletonDescriptionLine} style={{ width: "90%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (memoizedFacts.length === 0) {
    return null;
  }

  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={cn("subheading-small", styles.title)}>Facts</div>

        <div className={styles.facts}>
          {memoizedFacts.map((fact) => {
            const description = language === "ar" ? fact.descriptionAr : fact.descriptionEn;
            
            return (
            <div key={fact.id} className={styles.fact}>
                <div className={cn("gradient-bubble")}>{getIcon(fact.icon)}</div>
              <Heading type="heading-3" className={styles.fact_title}>
                {fact.title}
              </Heading>
              <div className={cn("paragraph-medium", styles.fact_description)}>
                  {description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Facts);
