"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import Image from "next/image";
import styles from "./news.module.css";

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
  updatedAt: string;
}

export default function NewsAdmin() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }
        fetchNews();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
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

  const handleDelete = async (id: number) => {
    if (!confirm(t("admin.news.confirmDelete"))) return;

    try {
      const response = await fetch(`/api/news?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchNews();
      } else {
        alert(t("admin.news.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert(t("admin.news.deleteError"));
    }
  };

  const handleTogglePin = async (newsItem: News) => {
    try {
      const response = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newsItem.id,
          isPinned: !newsItem.isPinned,
          order: newsItem.order,
        }),
      });

      if (response.ok) {
        fetchNews();
      } else {
        alert(t("admin.news.pinError"));
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
      alert(t("admin.news.pinError"));
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingNews(null);
    setShowForm(true);
  };

  if (loading) {
    return <div className={styles.loading}>{t("admin.news.loading")}</div>;
  }

  if (!Array.isArray(news)) {
    return <div className={styles.loading}>{t("admin.news.loading")}</div>;
  }

  const pinnedNews = news.filter((n) => n.isPinned);
  const regularNews = news.filter((n) => !n.isPinned);

  return (
    <div className={styles.container} dir={dir}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin" className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            {t("admin.news.backToDashboard")}
          </Link>
          <h1>{t("admin.news.title")}</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t("admin.news.addNew")}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t("admin.dashboard.logout")}
          </button>
        </div>
      </div>

      {showForm && (
        <NewsForm
          news={editingNews}
          onClose={() => {
            setShowForm(false);
            setEditingNews(null);
          }}
          onSuccess={() => {
            fetchNews();
            setShowForm(false);
            setEditingNews(null);
          }}
        />
      )}

      {pinnedNews.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {t("admin.news.pinnedNews")}
          </h2>
          <div className={styles.newsList}>
            {pinnedNews.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
                newsItem={newsItem}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t("admin.news.regularNews")}</h2>
        <div className={styles.newsList}>
          {regularNews.length === 0 ? (
            <div className={styles.emptyState}>{t("admin.news.noNews")}</div>
          ) : (
            regularNews.map((newsItem) => (
              <NewsCard
                key={newsItem.id}
                newsItem={newsItem}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function NewsCard({
  newsItem,
  onEdit,
  onDelete,
  onTogglePin,
}: {
  newsItem: News;
  onEdit: (news: News) => void;
  onDelete: (id: number) => void;
  onTogglePin: (news: News) => void;
}) {
  const { t, language } = useLanguage();

  return (
    <div className={`${styles.newsCard} ${newsItem.isPinned ? styles.pinned : ""}`}>
      {newsItem.isPinned && (
        <div className={styles.pinnedBadge}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {t("admin.news.pinned")}
        </div>
      )}
      {newsItem.image && (
        <div className={styles.newsImage}>
          <Image src={newsItem.image} alt={newsItem.titleEn} width={200} height={150} className={styles.image} />
        </div>
      )}
      <div className={styles.newsContent}>
        <h3>{language === "ar" ? newsItem.titleAr : newsItem.titleEn}</h3>
        <p className={styles.contentPreview}>
          {(language === "ar" ? newsItem.contentAr : newsItem.contentEn).substring(0, 150)}...
        </p>
        <div className={styles.newsMeta}>
          <span>{new Date(newsItem.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className={styles.newsActions}>
        <button onClick={() => onTogglePin(newsItem)} className={styles.pinButton}>
          {newsItem.isPinned ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {t("admin.news.unpin")}
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {t("admin.news.pin")}
            </>
          )}
        </button>
        <button onClick={() => onEdit(newsItem)} className={styles.editButton}>
          {t("admin.news.edit")}
        </button>
        <button onClick={() => onDelete(newsItem.id)} className={styles.deleteButton}>
          {t("admin.news.delete")}
        </button>
      </div>
    </div>
  );
}

function NewsForm({
  news,
  onClose,
  onSuccess,
}: {
  news: News | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t, dir } = useLanguage();
  const [formData, setFormData] = useState({
    titleEn: news?.titleEn || "",
    titleAr: news?.titleAr || "",
    contentEn: news?.contentEn || "",
    contentAr: news?.contentAr || "",
    image: news?.image || "",
    isPinned: news?.isPinned || false,
    order: news?.order || 0,
  });

  const [oldImage, setOldImage] = useState(news?.image || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("folder", "news");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(t("admin.news.uploadError"));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/news";
      const method = news ? "PUT" : "POST";
      const body = news ? { ...formData, id: news.id, oldImage } : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || t("admin.news.saveError"));
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error saving news:", error);
      alert(t("admin.news.saveError"));
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modal} dir={dir}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{news ? t("admin.news.editNews") : t("admin.news.addNews")}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.news.titleEn")}</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.news.titleAr")}</label>
              <input
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.news.contentEn")}</label>
              <textarea
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                required
                rows={6}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.news.contentAr")}</label>
              <textarea
                value={formData.contentAr}
                onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                required
                rows={6}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>{t("admin.news.image")}</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p>{t("admin.news.uploading")}</p>}
            {formData.image && (
              <div className={styles.imagePreview}>
                <Image src={formData.image} alt="Preview" width={200} height={150} className={styles.previewImage} />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: "" }));
                    if (news) {
                      setOldImage(news.image || "");
                    }
                  }}
                  className={styles.removeImageButton}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                />
                {t("admin.news.pinNews")}
              </label>
            </div>
            {formData.isPinned && (
              <div className={styles.formGroup}>
                <label>{t("admin.news.order")}</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={submitting || uploading}>
              {submitting ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  {news ? t("admin.news.updating") || "Updating..." : t("admin.news.creating") || "Creating..."}
                </>
              ) : uploading ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  {t("admin.news.uploading") || "Uploading..."}
                </>
              ) : (
                news ? t("admin.news.update") : t("admin.news.create")
              )}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting || uploading}>
              {t("admin.news.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

