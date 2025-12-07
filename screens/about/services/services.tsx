"use client";

import React from "react";
import styles from "./services.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    "about.services.service1",
    "about.services.service2",
    "about.services.service3",
    "about.services.service4",
    "about.services.service5",
    "about.services.service6",
    "about.services.service7",
  ];

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content_wrapper}>
          <div className={styles.text_section}>
            <Heading type="heading-2" className={styles.title}>
              {t("about.services.title")}
            </Heading>

            <ul className={styles.services_list}>
              {services.map((serviceKey, index) => (
                <li key={index} className={cn("paragraph-medium", styles.service_item)}>
                  <span className={styles.bullet}></span>
                  <span className={styles.service_text}>{t(serviceKey)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.image_section}>
            <div className={styles.image_container}>
              <Image
                src="/images/properties/commercial/downtown-office.webp"
                alt="Services"
                layout="fill"
                objectFit="cover"
                className={styles.image}
              />
            </div>
            <div className={styles.image_grid}>
              <div className={styles.image_small}>
                <Image
                  src="/images/properties/commercial/industrial-warehouse.webp"
                  alt="Services"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.image_small}>
                <Image
                  src="/images/properties/commercial/retail-space.webp"
                  alt="Services"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

