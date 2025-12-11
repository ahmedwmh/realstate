"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../benefits/benefits.module.css";

interface Showcase {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  thumbnailImage: string;
  videoUrl: string;
}

export default function ShowcaseAdmin() {
  const router = useRouter();
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const [loading, setLoading] = useState(true);
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
        fetchShowcase();
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

  const fetchShowcase = async () => {
    try {
      const response = await fetch("/api/showcase", { cache: "no-store" });
      const data = await response.json();
      setShowcase(data);
    } catch (error) {
      console.error("Error fetching showcase:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!showcase) return;
    if (!confirm("Are you sure you want to delete the showcase?")) return;

    try {
      const response = await fetch(`/api/showcase?id=${showcase.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchShowcase();
      } else {
        alert("Failed to delete showcase");
      }
    } catch (error) {
      console.error("Error deleting showcase:", error);
      alert("Error deleting showcase");
    }
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleAddNew = () => {
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading showcase...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin" className={styles.backButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
          <h1>Showcase Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={showcase ? handleEdit : handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {showcase ? "Edit Showcase" : "Add Showcase"}
          </button>
          {showcase && (
            <button onClick={handleDelete} className={styles.deleteButton}>
              Delete
            </button>
          )}
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <ShowcaseForm
          showcase={showcase}
          onClose={() => {
            setShowForm(false);
          }}
          onSuccess={() => {
            fetchShowcase();
            setShowForm(false);
          }}
        />
      )}

      {showcase && (
        <div className={styles.tableContainer}>
          <div className={styles.showcaseCard}>
            <div className={styles.showcaseImage}>
              <Image
                src={showcase.thumbnailImage}
                alt={showcase.titleEn}
                width={400}
                height={300}
                className={styles.previewImage}
              />
              <div className={styles.videoBadge}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                Video Showcase
              </div>
            </div>
            <div className={styles.showcaseContent}>
              <div className={styles.showcaseHeader}>
                <h2>{showcase.titleEn}</h2>
                <div className={styles.languageBadge}>
                  <span className={styles.badge}>EN</span>
                  <span className={styles.badge}>AR</span>
                </div>
              </div>
              <div className={styles.showcaseInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Arabic Title:</span>
                  <span className={styles.infoValue}>{showcase.titleAr}</span>
                </div>
                <div className={styles.infoSection}>
                  <span className={styles.infoLabel}>Description (EN):</span>
                  <p className={styles.infoText}>{showcase.descriptionEn}</p>
                </div>
                <div className={styles.infoSection}>
                  <span className={styles.infoLabel}>Description (AR):</span>
                  <p className={styles.infoText}>{showcase.descriptionAr}</p>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Video URL:</span>
                  <a href={showcase.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                    {showcase.videoUrl}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showcase && (
        <div className={styles.tableContainer}>
          <div className={styles.noData}>
            No showcase configured. Click &quot;Add Showcase&quot; to create one.
          </div>
        </div>
      )}
    </div>
  );
}

function ShowcaseForm({
  showcase,
  onClose,
  onSuccess,
}: {
  showcase: Showcase | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    titleEn: showcase?.titleEn || "",
    titleAr: showcase?.titleAr || "",
    descriptionEn: showcase?.descriptionEn || "",
    descriptionAr: showcase?.descriptionAr || "",
    thumbnailImage: showcase?.thumbnailImage || "",
    videoUrl: showcase?.videoUrl || "",
  });

  const [uploading, setUploading] = useState(false);
  const [oldThumbnailImage, setOldThumbnailImage] = useState(showcase?.thumbnailImage || "");
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "showcase");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, thumbnailImage: data.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Utility function to convert YouTube URLs to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return url;
    
    // Already an embed URL
    if (url.includes('/embed/')) {
      return url;
    }
    
    // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    
    // Return as-is if no match (might be other video platform)
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/showcase";
      const method = showcase ? "PUT" : "POST";
      
      // Convert video URL to embed format before saving
      const videoUrl = convertToEmbedUrl(formData.videoUrl);
      
      const body = showcase
        ? { ...formData, videoUrl, id: showcase.id, oldThumbnailImage }
        : { ...formData, videoUrl };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save showcase");
      }
    } catch (error) {
      console.error("Error saving showcase:", error);
      alert("Error saving showcase");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modal} onClick={handleModalClick}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{showcase ? "Edit Showcase" : "Add New Showcase"}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>English Title</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Arabic Title</label>
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
              <label>English Description</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                required
                rows={4}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Arabic Description</label>
              <textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                required
                rows={4}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Thumbnail Image</label>
              <div className={styles.fileUploadWrapper}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className={styles.fileInput}
                  id="thumbnailInput"
                />
                <label htmlFor="thumbnailInput" className={styles.fileInputLabel}>
                  {uploading ? "Uploading..." : formData.thumbnailImage ? "Change Image" : "Choose Thumbnail"}
                </label>
              </div>
              {formData.thumbnailImage && (
                <div className={styles.imagePreviewContainer}>
                  <Image
                    src={formData.thumbnailImage}
                    alt="Preview"
                    width={300}
                    height={200}
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Video URL (YouTube)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://www.youtube.com/embed/VIDEO_ID"
                required
              />
              <small style={{ marginTop: "0.25rem", color: "var(--gray-500)", fontSize: "0.875rem" }}>
                You can use either YouTube watch URL or embed URL. It will be automatically converted to embed format.
              </small>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting || uploading}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={submitting || uploading}>
              {submitting ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  {showcase ? "Updating..." : "Creating..."}
                </>
              ) : uploading ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  Uploading Image...
                </>
              ) : (
                showcase ? "Update Showcase" : "Create Showcase"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

