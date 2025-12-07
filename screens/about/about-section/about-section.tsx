"use client";

import React from "react";
import styles from "./about-section.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <div className={styles.arabic_section}>
            <Heading type="heading-2" className={styles.title}>
              {t("about.aboutUs")}
            </Heading>
            <div className={cn("paragraph-large", styles.description)}>
              {t("about.description")}
            </div>
          </div>

          <div className={styles.image_wrapper}>
            <div className={styles.image_container}>
              <Image
                src="/images/intro.webp"
                alt="About Us"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </div>
          </div>

          <div className={styles.english_section}>
            <div className={cn("paragraph-large", styles.description_en)}>
              {t("about.descriptionEn")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

