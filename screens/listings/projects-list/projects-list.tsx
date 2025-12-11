"use client";

import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./projects-list.module.css";
import { Heading } from "@/components/typography";
import { Dropdown } from "@/components/elements";
import PropertyListing from "@/components/property-listing";
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

export default function ProjectsList() {
  const { language, t, dir } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
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
  const categories = Array.from(new Set(projects.map((p) => p.category)));
  const allCategories = ["All", ...categories];

  // Translate category names
  const getCategoryLabel = (category: string) => {
    return t(`listings.categories.${category}`) || category;
  };

  const dropdownOptions = allCategories.map((cat) => ({
    value: cat,
    label: getCategoryLabel(cat),
  }));

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const convertProjectToItem = (project: Project) => {
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
  };

  if (loading) {
    return (
      <section className={cn("section", styles.section)} dir={dir}>
        <div className={cn("container", styles.container)}>
          <div className={styles.loading}>{t("listings.loading")}</div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("section", styles.section)} dir={dir}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrapper}>
          <Dropdown
            className={styles.dropdown}
            options={dropdownOptions}
            value={selectedCategory}
            onChange={handleDropdownChange}
          />
          <div className={styles.tabs}>
            {allCategories.map((cat) => (
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

