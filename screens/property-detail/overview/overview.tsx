"use client";

import React from "react";
import styles from "./overview.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import { Plus } from "@/constants/icons";
import { useLanguage } from "@/context/language-context";

type OverviewProps = {
  project: {
    id: number;
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    category: string;
    features: {
      id: number;
      icon: string;
      name: string;
      value: string | number;
    }[] | null;
    generalInfo?: {
      itemsEn?: string[];
      itemsAr?: string[];
    } | null;
    interiorDetails?: {
      itemsEn?: string[];
      itemsAr?: string[];
    } | null;
  };
};

export default function Overview({ project }: OverviewProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = React.useState<number | null>(null);

  const description = language === "ar" ? project.descriptionAr : project.descriptionEn;

  // Get dynamic details from project data
  const generalInfoItems = language === "ar" 
    ? (project.generalInfo?.itemsAr || [])
    : (project.generalInfo?.itemsEn || []);
  
  const interiorDetailsItems = language === "ar"
    ? (project.interiorDetails?.itemsAr || [])
    : (project.interiorDetails?.itemsEn || []);

  const details = [
    {
      id: 1,
      titleKey: "propertyDetail.generalInformation",
      items: generalInfoItems,
    },
    {
      id: 2,
      titleKey: "propertyDetail.interiorDetails",
      items: interiorDetailsItems,
    },
  ].filter(detail => detail.items.length > 0); // Only show sections with items

  const toggleOpen = (id: number) => {
    setOpen((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <Heading type="heading-3">{t("propertyDetail.overview")}</Heading>
          {description && (
          <div className={cn("paragraph-medium", styles.description)}>
              {description}
          </div>
          )}

          <div className={styles.details}>
            {details.map((detail) => (
              <div key={detail.id} className={styles.detail}>
                <div
                  className={cn(styles.detail_head, {
                    [styles.open]: open === detail.id,
                  })}
                  onClick={() => toggleOpen(detail.id)}
                >
                  <div className={cn("paragraph-x-large", styles.detail_title)}>
                    {t(detail.titleKey)}
                  </div>

                  {Plus}
                </div>

                {open === detail.id && (
                  <ul className={styles.list}>
                    {detail.items.map((item, index) => (
                      <li
                        key={index}
                        className={cn("paragraph-medium", styles.list_item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
