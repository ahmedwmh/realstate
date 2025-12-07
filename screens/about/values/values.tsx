"use client";

import React from "react";
import styles from "./values.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

export default function Values() {
  const { t } = useLanguage();

  const values = [
    {
      id: 1,
      titleKey: "about.values.commitment.title",
      descriptionKey: "about.values.commitment.description",
    },
    {
      id: 2,
      titleKey: "about.values.professionalism.title",
      descriptionKey: "about.values.professionalism.description",
    },
    {
      id: 3,
      titleKey: "about.values.innovation.title",
      descriptionKey: "about.values.innovation.description",
    },
    {
      id: 4,
      titleKey: "about.values.transparency.title",
      descriptionKey: "about.values.transparency.description",
    },
    {
      id: 5,
      titleKey: "about.values.quality.title",
      descriptionKey: "about.values.quality.description",
    },
  ];

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <div className={styles.arabic_section}>
            <Heading type="heading-2" className={styles.title}>
              {t("about.values.title")}
            </Heading>
            <ul className={styles.values_list}>
              {values.map((value) => (
                <li key={value.id} className={styles.value_item}>
                  <span className={styles.bullet}></span>
                  <div className={styles.value_content}>
                    <div className={cn("paragraph-x-large", styles.value_title)}>
                      {t(value.titleKey)}:
                    </div>
                    <div className={cn("paragraph-medium", styles.value_description)}>
                      {t(value.descriptionKey)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.image_wrapper}>
            <div className={styles.image_container}>
              <Image
                src="/images/gallery/01.webp"
                alt="Values"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </div>
          </div>

          <div className={styles.english_section}>
            <div className={styles.subtitle_wrapper}>
              <span className={styles.orange_square}></span>
              <div className={cn("subheading-medium", styles.subtitle)}>
                {t("about.values.titleEn")}
              </div>
            </div>
            <ul className={styles.values_list_en}>
              {values.map((value) => (
                <li key={value.id} className={styles.value_item_en}>
                  <span className={styles.bullet}></span>
                  <div className={styles.value_content}>
                    <div className={cn("paragraph-x-large", styles.value_title_en)}>
                      {t(value.titleKey + "En")}:
                    </div>
                    <div className={cn("paragraph-medium", styles.value_description_en)}>
                      {t(value.descriptionKey + "En")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
