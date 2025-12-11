"use client";

import React, { useMemo, useCallback } from "react";
import styles from "./services.module.css";
import cn from "classnames";
import {
  Bag,
  BubbleChart,
  Building,
  DoubleBed,
  House,
  TrendUp,
} from "@/constants/icons";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { Service } from "@/types";
import * as Icons from "@/constants/icons";

const iconMap: Record<string, React.ReactNode> = {
  House,
  TrendUp,
  Building,
  Bag,
  BubbleChart,
  DoubleBed,
};

// Stable transform function to prevent re-renders
const transformServices = (data: any): Service[] => {
  return Array.isArray(data) ? data : [];
};

function Services() {
  const { language } = useLanguage();
  const { data: servicesData, loading } = useApiFetch<Service[]>({
    endpoint: "/api/services",
    cache: "no-store",
    transform: transformServices,
  });

  // Ensure services is always an array - must be called before any conditional returns
  const services = useMemo(() => {
    return Array.isArray(servicesData) ? servicesData : [];
  }, [servicesData]);

  // Memoize services for rendering - must be called before any conditional returns
  const memoizedServices = useMemo(() => services, [services]);

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
          <div className={cn("subheading-small", styles.title)}>Our services</div>
          <div className={styles.services}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className={styles.service}>
                <div className={styles.skeletonIcon} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonDescription} />
                <div className={styles.skeletonDescription} style={{ width: "90%" }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (memoizedServices.length === 0) {
    return null;
  }

  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={cn("subheading-small", styles.title)}>Our services</div>

        <div className={styles.services}>
          {memoizedServices.map((service) => {
            const title = language === "ar" ? service.titleAr : service.titleEn;
            const description = language === "ar" ? service.descriptionAr : service.descriptionEn;
            
            return (
            <div key={service.id} className={styles.service}>
                <div className={cn("gradient-bubble")}>{getIcon(service.icon)}</div>
                <div className={cn("heading-6", styles.service_title)}>{title}</div>
                <div className={cn("paragraph-medium", styles.service_subtitle)}>{description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default React.memo(Services);
