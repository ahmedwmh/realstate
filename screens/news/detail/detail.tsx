"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import Layout from "@/components/Layout";
import styles from "./detail.module.css";
import cn from "classnames";

interface News {
  id: number;
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  image?: string;
  isPinned: boolean;
  createdAt: string;
}

export default function NewsDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { language, t, dir } = useLanguage();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [id]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();
      const newsItem = Array.isArray(data) ? data.find((n: News) => n.id === parseInt(id)) : null;
      if (newsItem) {
        setNews(newsItem);
      } else {
        router.push("/news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      router.push("/news");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = language === "ar" ? news?.titleAr : news?.titleEn;

    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: title || "",
          text: title || "",
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      } finally {
        setSharing(false);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert(language === "ar" ? "تم نسخ الرابط!" : "Link copied!");
      } catch (error) {
        console.error("Error copying:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === "ar") {
      // Use Arabic date format
      return date.toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        calendar: "gregory", // Use Gregorian calendar
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>{t("news.loading")}</div>
      </Layout>
    );
  }

  if (!news) {
    return (
      <Layout>
        <div className={styles.notFound}>{t("news.notFound")}</div>
      </Layout>
    );
  }

  const title = language === "ar" ? news.titleAr : news.titleEn;
  const content = language === "ar" ? news.contentAr : news.contentEn;

  return (
    <Layout>
      <section className={cn("section", styles.section)} dir={dir}>
        <div className={cn("container", styles.container)}>
          <Link href="/news" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {t("news.backToNews")}
          </Link>

          <article className={styles.article}>
            {news.image && (
              <div className={styles.imageContainer}>
                <Image 
                  src={news.image.startsWith("http") && !news.image.includes("?") 
                    ? `${news.image}?t=${Date.now()}` 
                    : news.image} 
                  alt={title} 
                  fill 
                  className={styles.image} 
                  priority
                  unoptimized={news.image.startsWith("http")}
                />
                {news.isPinned && (
                  <div className={styles.pinnedBadge}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {t("news.pinned")}
                  </div>
                )}
              </div>
            )}

            <div className={styles.content}>
              <div className={styles.header}>
                <div className={styles.meta}>
                  <time dateTime={news.createdAt} className={styles.date}>
                    {formatDate(news.createdAt)}
                  </time>
                  {news.isPinned && (
                    <span className={styles.pinnedTag}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {t("news.pinned")}
                    </span>
                  )}
                </div>

                <button onClick={handleShare} className={styles.shareButton} disabled={sharing}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  {sharing ? t("news.sharing") : t("news.share")}
                </button>
              </div>

              <h1 className={styles.title}>{title}</h1>

              <div className={styles.text} dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }} />
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}

