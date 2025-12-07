"use client";

import React from "react";
import styles from "./hero.module.css";
import cn from "classnames";
import { Hero as Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";

export default function NewsHero() {
  const { t } = useLanguage();

  return (
    <>
      <section className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.overlay} />

          <Heading size="hero-lg" className={styles.title}>
            {t("news.hero.title")}
          </Heading>
        </div>
      </section>
    </>
  );
}

