"use client";

import React from "react";
import styles from "./vision.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

export default function Vision() {
  const { t } = useLanguage();

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <div className={styles.arabic_section}>
            <Heading type="heading-2" className={styles.title}>
              {t("about.vision.title")}
            </Heading>
            <div className={cn("paragraph-large", styles.description)}>
              {t("about.vision.description")}
            </div>
          </div>

          <div className={styles.image_wrapper}>
            <div className={styles.image_container}>
              <Image
                src="/images/properties/houses/123-serenity-lane.webp"
                alt="Vision"
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
                {t("about.vision.titleEn")}
              </div>
            </div>
            <div className={cn("paragraph-large", styles.description_en)}>
              {t("about.vision.descriptionEn")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

