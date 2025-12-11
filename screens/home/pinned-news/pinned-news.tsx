"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import styles from "./pinned-news.module.css";
import { Heading } from "@/components/typography";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";

interface News {
  id: number;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  image?: string;
  isPinned: boolean;
  order?: number;
  createdAt: string;
}

export default function PinnedNews() {
  const { language, t, dir } = useLanguage();

  const { data: allNews, loading } = useApiFetch<News[]>({
    endpoint: "/api/news",
    cache: "no-store",
    transform: (data) => Array.isArray(data) ? data : [],
  });

  // Filter only pinned news and sort by order, then by date
  const pinnedNews = React.useMemo(() => {
    if (!Array.isArray(allNews)) return [];
    return allNews
      .filter((news) => news.isPinned)
      .sort((a, b) => {
        // First sort by order if available
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // Then by createdAt (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 3); // Show only first 3 pinned news
  }, [allNews]);

  if (loading) {
    return null;
  }

  if (!pinnedNews || pinnedNews.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  return (
    <section className={cn("section", styles.section)} dir={dir}>
      <div className={cn("container", styles.container)}>
        <div className={styles.header}>
          <div>
            <Heading type="heading-3" className={styles.title}>
              {t("home.pinnedNews.title") || (language === "ar" ? "الأخبار الثابتة" : "Pinned News")}
            </Heading>
            <div className={cn("paragraph-large", styles.subtitle)}>
              {t("home.pinnedNews.subtitle") || (language === "ar" ? "تابع آخر الأخبار والتحديثات من شركتنا" : "Stay updated with our latest news and updates")}
            </div>
          </div>
          <Link href="/news" className={cn("button", styles.viewAllButton)}>
            {t("home.pinnedNews.viewAll") || (language === "ar" ? "عرض جميع الأخبار" : "View All News")}
          </Link>
        </div>

        <div className={styles.cardsGrid}>
          {pinnedNews.map((newsItem) => {
            const title = language === "ar" ? newsItem.titleAr : newsItem.titleEn;
            const content = language === "ar" ? newsItem.contentAr : newsItem.contentEn;
            const imageUrl = newsItem.image?.startsWith("http") && !newsItem.image.includes("?")
              ? `${newsItem.image}?t=${Date.now()}`
              : newsItem.image;

            return (
              <Link 
                key={newsItem.id} 
                href={`/news/${newsItem.id}`} 
                className={styles.newsCard}
              >
                {newsItem.image && (
                  <div className={styles.imageContainer}>
                    <Image
                      src={imageUrl || ""}
                      alt={title}
                      fill
                      style={{ objectFit: "cover" }}
                      className={styles.image}
                      unoptimized={newsItem.image?.startsWith("http")}
                      loading="lazy"
                    />
                    <div className={styles.pinnedBadge}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {language === "ar" ? "مثبت" : "Pinned"}
                    </div>
                  </div>
                )}

                <div className={styles.content}>
                  <h3 className={styles.newsTitle}>{title}</h3>
                  <p className={styles.newsContent}>
                    {content.length > 150 ? content.substring(0, 150) + "..." : content}
                  </p>
                  <div className={styles.meta}>
                    <time className={styles.date}>
                      {formatDate(newsItem.createdAt)}
                    </time>
                    <span className={styles.readMore}>
                      {t("news.readMore") || (language === "ar" ? "اقرأ المزيد" : "Read More")}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

