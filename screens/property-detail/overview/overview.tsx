"use client";

import React from "react";
import styles from "./overview.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import PropertyFeatures from "@/components/property-features";
import { Plus } from "@/constants/icons";
import AgentForm from "@/components/agent-form";
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
  };
};

export default function Overview({ project }: OverviewProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = React.useState<number | null>(null);

  const description = language === "ar" ? project.descriptionAr : project.descriptionEn;
  const features = project.features || [];

  const details = [
    {
      id: 1,
      titleKey: "propertyDetail.generalInformation",
      features: [
        {
          id: 1,
          textKey: "propertyDetail.generalInfoText1",
        },
        {
          id: 2,
          textKey: "propertyDetail.generalInfoText2",
        },
        {
          id: 3,
          textKey: "propertyDetail.generalInfoText3",
        },
        {
          id: 4,
          textKey: "propertyDetail.generalInfoText4",
        },
      ],
    },
    {
      id: 2,
      titleKey: "propertyDetail.interiorDetails",
      features: [
        {
          id: 1,
          textKey: "propertyDetail.interiorText1",
        },
        {
          id: 2,
          textKey: "propertyDetail.interiorText2",
        },
      ],
    },
  ];

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

          {features.length > 0 && (
          <PropertyFeatures
            className={styles.features}
              features={features}
          />
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
                    {detail.features.map((feature) => (
                      <li
                        key={feature.id}
                        className={cn("paragraph-medium", styles.list_item)}
                      >
                        {t(feature.textKey)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.agent}>
          <AgentForm
            className={styles.form}
            inputClassName={styles.textfield}
          />
        </div>
      </div>
    </section>
  );
}
