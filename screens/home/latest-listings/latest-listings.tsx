"use client";

import React from "react";
import cn from "classnames";
import styles from "./latest-listings.module.css";
import { Heading } from "@/components/typography";
import { Dropdown } from "@/components/elements";
import PropertyListing from "@/components/property-listing";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

interface Project {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  images: string[];
  address?: string;
  features?: any;
}

export default function LatestListings() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("All");

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["All", ...cats];
  }, [projects]);

  // Translate category names
  const getCategoryLabel = React.useCallback((category: string) => {
    return t(`listings.categories.${category}`) || category;
  }, [t]);

  const dropdownOptions = categories.map((cat) => ({
    value: cat,
    label: getCategoryLabel(cat),
  }));

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProjects = React.useMemo(() => {
    if (selectedCategory === "All") return projects.slice(0, 6);
    return projects.filter((p) => p.category === selectedCategory).slice(0, 6);
  }, [projects, selectedCategory]);

  const convertProjectToItem = (project: Project) => {
    const title = language === "ar" ? project.titleAr : project.titleEn;
    const description = language === "ar" ? project.descriptionAr : project.descriptionEn;
    
    return {
      id: project.id,
      images: project.images || [],
      title,
      price: "",
      description: description.substring(0, 150) + "...",
      features: project.features ? Object.entries(project.features).map(([key, value], idx) => ({
        id: idx + 1,
        icon: key === "bedrooms" ? "double-bed" : key === "bathrooms" ? "bath" : "ruler",
        name: key === "bedrooms" ? "bd" : key === "bathrooms" ? "ba" : "sqft",
        value: String(value),
      })) : [],
    };
  };

  if (loading) {
    return null;
  }

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
                onClick={() => setSelectedCategory(cat)}
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
        </div>
      </div>
    </section>
  );
}
