"use client";

import React from "react";
import styles from "./hero.module.css";
import cn from "classnames";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

type HeroProps = {
  project: {
    id: number;
    titleEn: string;
    titleAr: string;
    address: string | null;
    images: string[];
  };
};

export default function Hero({ project }: HeroProps) {
  const { language } = useLanguage();
  const title = language === "ar" ? project.titleAr : project.titleEn;
  const images = project.images || [];

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container")}>
        <div className={styles.content}>
          <div>
            <div className={cn("heading-2", styles.title)}>{title}</div>
            {project.address && (
            <div className={cn("paragraph-large", styles.address)}>
                {project.address}
            </div>
            )}
          </div>
        </div>

        {images.length > 0 && (
        <div className={styles.images}>
            {images[0] && (
              <div className={styles.image}>
                <Image
                  src={images[0]}
                  alt={title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized={images[0]?.startsWith("http")}
                />
              </div>
            )}

            {images.length > 1 && (
              <div className={styles.grid_images}>
                <div className={styles.row_images}>
                  {images[1] && (
                    <div className={styles.image}>
                      <Image
                        src={images[1]}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={images[1]?.startsWith("http")}
                      />
                    </div>
                  )}
                  {images[2] && (
              <div className={styles.image}>
                <Image
                        src={images[2]}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={images[2]?.startsWith("http")}
                />
              </div>
                  )}
            </div>

                {images[3] && (
            <div className={styles.image}>
              <Image
                      src={images[3]}
                      alt={title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                      unoptimized={images[3]?.startsWith("http")}
              />
            </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
