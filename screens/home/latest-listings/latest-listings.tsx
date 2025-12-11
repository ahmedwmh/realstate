"use client";

import React, { useMemo, useCallback } from "react";
import cn from "classnames";
import styles from "./latest-listings.module.css";
import { Heading } from "@/components/typography";
import { Dropdown } from "@/components/elements";
import PropertyListing from "@/components/property-listing";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { Project } from "@/types";

// Stable transform function to prevent re-renders
const transformProjects = (data: any): Project[] => {
  return Array.isArray(data) ? data : [];
};

function LatestListings() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const { data: projectsData, loading } = useApiFetch<Project[]>({
    endpoint: "/api/projects",
    cache: "no-store",
    transform: transformProjects,
  });

  // Ensure projects is always an array
  const projects = React.useMemo(() => {
    return Array.isArray(projectsData) ? projectsData : [];
  }, [projectsData]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return ["All"];
    }
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...cats];
  }, [projects]);

  // Translate category names
  const getCategoryLabel = useCallback((category: string) => {
    return t(`listings.categories.${category}`) || category;
  }, [t]);

  const dropdownOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat,
      label: getCategoryLabel(cat),
    }));
  }, [categories, getCategoryLabel]);

  const handleDropdownChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleCategoryClick = useCallback((cat: string) => {
    setSelectedCategory(cat);
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects.slice(0, 6);
    return projects.filter((p) => p.category === selectedCategory).slice(0, 6);
  }, [projects, selectedCategory]);

  const convertProjectToItem = useCallback((project: Project) => {
    const title = language === "ar" ? project.titleAr : project.titleEn;
    const description = language === "ar" ? project.descriptionAr : project.descriptionEn;
    
    return {
      id: project.id,
      images: project.images || [],
      title,
      price: "",
      description: description.substring(0, 150) + "...",
      features: [],
    };
  }, [language]);

  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.content}>
          <div>
            <Heading type="heading-3" className={styles.title}>
              {t("listings.title")}
            </Heading>
            <div className={cn("paragraph-large", styles.subtitle)}>
              {t("listings.subtitle")}
            </div>
          </div>

          <Link href="/listings" className={cn("button", styles.button)}>
            {t("listings.viewAll")}
          </Link>
        </div>

        <div className={styles.wrapper}>
          {loading ? (
            <>
              <div className={styles.skeletonTabs} />
              <div className={styles.listings}>
                {[...Array(6)].map((_, index) => (
                  <div key={index} className={styles.skeletonCard}>
                    <div className={styles.skeletonCardImage} />
                    <div className={styles.skeletonCardContent}>
                      <div className={styles.skeletonCardTitle} />
                      <div className={styles.skeletonCardDescription} />
                      <div className={styles.skeletonCardDescription} style={{ width: "80%" }} />
                      <div className={styles.skeletonCardFeatures}>
                        <div className={styles.skeletonFeature} />
                        <div className={styles.skeletonFeature} />
                        <div className={styles.skeletonFeature} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <Dropdown
                className={styles.dropdown}
                options={dropdownOptions}
                value={selectedCategory}
                onChange={handleDropdownChange}
              />
              <div className={styles.tabs}>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={cn("label-medium", styles.tab, {
                      [styles.active]: cat === selectedCategory,
                    })}
                    onClick={() => handleCategoryClick(cat)}
                  >
                    {getCategoryLabel(cat)}
                  </div>
                ))}
              </div>

              <div className={styles.listings}>
                {filteredProjects.length === 0 ? (
                  <div className={styles.emptyState}>{t("listings.noProjects")}</div>
                ) : (
                  filteredProjects.map((project) => (
                    <PropertyListing key={project.id} item={convertProjectToItem(project)} />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default React.memo(LatestListings);
