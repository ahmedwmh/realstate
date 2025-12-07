"use client";

import React from "react";
import styles from "./mission.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

export default function Mission() {
  const { t } = useLanguage();

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content_wrapper}>
          <div className={styles.text_section}>
            <div className={cn("subheading-small", styles.label)}>
              {t("about.mission.label")}
            </div>
            <div className={styles.content}>
              <div className={cn("paragraph-large", styles.subtitle)}>
                {t("about.mission.subtitle")}
              </div>

              <div className={styles.divider} />

              <Heading type="heading-3" className={styles.title}>
                {t("about.mission.title")}
              </Heading>
            </div>
          </div>

          <div className={styles.image_section}>
            <div className={styles.image_container}>
              <Image
                src="/images/benefit-1.webp"
                alt="Mission"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
