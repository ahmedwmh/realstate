"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import styles from "./news-list.module.css";
import cn from "classnames";

interface News {
  id: number;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  image?: string;
  isPinned: boolean;
  order: number;
  createdAt: string;
}

export default function NewsList() {
  const { language, t, dir } = useLanguage();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.loading}>{t("news.loading")}</div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(news)) {
    return (
      <section className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.loading}>{t("news.loading")}</div>
        </div>
      </section>
    );
  }

  const pinnedNews = news.filter((n) => n.isPinned);
  const regularNews = news.filter((n) => !n.isPinned);

  return (
    <section className={cn("section", styles.section)} dir={dir}>
      <div className={cn("container", styles.container)}>
        {pinnedNews.length > 0 && (
          <div className={styles.newsSection}>
            <h2 className={styles.sectionTitle}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {t("news.pinnedNews")}
            </h2>
            <div className={styles.newsGrid}>
              {pinnedNews.map((newsItem) => (
                <NewsCard key={newsItem.id} newsItem={newsItem} language={language} />
              ))}
            </div>
          </div>
        )}

        <div className={styles.newsSection}>
          <h2 className={styles.sectionTitle}>{t("news.regularNews")}</h2>
          {regularNews.length === 0 ? (
            <div className={styles.emptyState}>{t("news.noNews")}</div>
          ) : (
            <div className={styles.newsGrid}>
              {regularNews.map((newsItem) => (
                <NewsCard key={newsItem.id} newsItem={newsItem} language={language} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function NewsCard({ newsItem, language }: { newsItem: News; language: string }) {
  const { t } = useLanguage();
  const title = language === "ar" ? newsItem.titleAr : newsItem.titleEn;
  const content = language === "ar" ? newsItem.contentAr : newsItem.contentEn;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === "ar") {
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const date = formatDate(newsItem.createdAt);

  return (
    <Link href={`/news/${newsItem.id}`} className={`${styles.newsCard} ${newsItem.isPinned ? styles.pinned : ""}`}>
      {newsItem.isPinned && (
        <div className={styles.pinnedBadge}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {language === "ar" ? "مثبت" : "Pinned"}
        </div>
      )}
      {newsItem.image && (
        <div className={styles.newsImage}>
          <Image 
            src={newsItem.image.startsWith("http") && !newsItem.image.includes("?") 
              ? `${newsItem.image}?t=${Date.now()}` 
              : newsItem.image} 
            alt={title} 
            fill 
            className={styles.image}
            unoptimized={newsItem.image.startsWith("http")}
            loading="lazy"
          />
        </div>
      )}
      <div className={styles.newsContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.content}>{content}</p>
        <div className={styles.meta}>
          <time dateTime={newsItem.createdAt}>{date}</time>
          <span className={styles.readMore}>{t("news.readMore")}</span>
        </div>
      </div>
    </Link>
  );
}

