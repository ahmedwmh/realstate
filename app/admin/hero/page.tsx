"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./hero.module.css";

interface HeroSlide {
  id: number;
  order: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  mainImage: string;
  contentImage: string;
}

export default function HeroAdmin() {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [filteredSlides, setFilteredSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }
        fetchSlides();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSlides(slides);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = slides.filter(
        (slide) =>
          slide.titleEn.toLowerCase().includes(query) ||
          slide.titleAr.toLowerCase().includes(query) ||
          slide.descriptionEn.toLowerCase().includes(query) ||
          slide.descriptionAr.toLowerCase().includes(query) ||
          slide.order.toString().includes(query)
      );
      setFilteredSlides(filtered);
    }
  }, [searchQuery, slides]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await fetch("/api/hero", { cache: "no-store" });
      const data = await response.json();
      const sortedData = Array.isArray(data) 
        ? data.sort((a: HeroSlide, b: HeroSlide) => a.order - b.order)
        : [];
      setSlides(sortedData);
      setFilteredSlides(sortedData);
    } catch (error) {
      console.error("Error fetching slides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const response = await fetch(`/api/hero?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSlides();
      } else {
        alert("Failed to delete slide");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Error deleting slide");
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading hero slides...</p>
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
          <h1>Hero Section Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Slide
          </button>
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
        <HeroForm
          slide={editingSlide}
          onClose={() => {
            setShowForm(false);
            setEditingSlide(null);
          }}
          onSuccess={() => {
            fetchSlides();
            setShowForm(false);
            setEditingSlide(null);
          }}
        />
      )}

      <div className={styles.tableContainer}>
        <div className={styles.searchBar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search slides by title, description, or order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className={styles.clearButton}>
              ×
            </button>
          )}
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Main Image</th>
                <th>Content Image</th>
                <th>Title (EN)</th>
                <th>Title (AR)</th>
                <th>Description (EN)</th>
                <th>Description (AR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSlides.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    {searchQuery ? "No slides found matching your search." : "No hero slides available."}
                  </td>
                </tr>
              ) : (
                filteredSlides.map((slide) => (
                  <tr key={slide.id}>
                    <td>
                      <span className={styles.orderBadge}>{slide.order}</span>
                    </td>
                    <td>
                      <div className={styles.imageCell}>
                <Image
                  src={slide.mainImage}
                  alt={slide.titleEn}
                          width={80}
                          height={60}
                          className={styles.tableImage}
                />
              </div>
                    </td>
                    <td>
                      <div className={styles.imageCell}>
                <Image
                  src={slide.contentImage}
                  alt={slide.titleEn}
                          width={80}
                          height={60}
                          className={styles.tableImage}
                />
              </div>
                    </td>
                    <td className={styles.titleCell}>{slide.titleEn}</td>
                    <td className={styles.titleCell}>{slide.titleAr}</td>
                    <td className={styles.descriptionCell}>
                      {slide.descriptionEn.length > 50 
                        ? `${slide.descriptionEn.substring(0, 50)}...` 
                        : slide.descriptionEn}
                    </td>
                    <td className={styles.descriptionCell}>
                      {slide.descriptionAr.length > 50 
                        ? `${slide.descriptionAr.substring(0, 50)}...` 
                        : slide.descriptionAr}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
              <button onClick={() => handleEdit(slide)} className={styles.editButton}>
                Edit
              </button>
              <button onClick={() => handleDelete(slide.id)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredSlides.length > 0 && (
          <div className={styles.tableFooter}>
            Showing {filteredSlides.length} of {slides.length} slide{slides.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function HeroForm({
  slide,
  onClose,
  onSuccess,
}: {
  slide: HeroSlide | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    titleEn: slide?.titleEn || "",
    titleAr: slide?.titleAr || "",
    descriptionEn: slide?.descriptionEn || "",
    descriptionAr: slide?.descriptionAr || "",
    mainImage: slide?.mainImage || "",
    contentImage: slide?.contentImage || "",
    order: slide?.order || 0,
  });

  const [uploading, setUploading] = useState<string | null>(null);
  const [oldMainImage, setOldMainImage] = useState(slide?.mainImage || "");
  const [oldContentImage, setOldContentImage] = useState(slide?.contentImage || "");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "mainImage" | "contentImage") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "hero");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, [type]: data.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = slide ? "/api/hero" : "/api/hero";
      const method = slide ? "PUT" : "POST";
      const body = slide
        ? { ...formData, id: slide.id, oldMainImage, oldContentImage }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save slide");
      }
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Error saving slide");
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
          <h2>{slide ? "Edit Slide" : "Add New Slide"}</h2>
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
              <label>Main Image</label>
              <div className={styles.fileUploadWrapper}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "mainImage")}
                disabled={uploading === "mainImage"}
                  className={styles.fileInput}
                  id="mainImageInput"
                />
                <label htmlFor="mainImageInput" className={styles.fileInputLabel}>
                  {uploading === "mainImage" ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.uploadSpinner}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                      Uploading...
                    </>
                  ) : formData.mainImage ? (
                    "Change Image"
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Choose Main Image
                    </>
                  )}
                </label>
              </div>
              {formData.mainImage && (
                <div className={styles.imagePreviewContainer}>
                <Image
                  src={formData.mainImage}
                  alt="Main"
                    width={300}
                    height={200}
                  className={styles.previewImage}
                />
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Content Image</label>
              <div className={styles.fileUploadWrapper}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "contentImage")}
                disabled={uploading === "contentImage"}
                  className={styles.fileInput}
                  id="contentImageInput"
                />
                <label htmlFor="contentImageInput" className={styles.fileInputLabel}>
                  {uploading === "contentImage" ? (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.uploadSpinner}>
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-16;-32;-32" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                      Uploading...
                    </>
                  ) : formData.contentImage ? (
                    "Change Image"
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Choose Content Image
                    </>
                  )}
                </label>
              </div>
              {formData.contentImage && (
                <div className={styles.imagePreviewContainer}>
                <Image
                  src={formData.contentImage}
                  alt="Content"
                    width={300}
                    height={200}
                  className={styles.previewImage}
                />
                </div>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              min={0}
              placeholder="0"
            />
            <small className={styles.helperText}>Lower numbers appear first</small>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={submitting}>
              {submitting ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  {slide ? "Updating..." : "Creating..."}
                </>
              ) : (
                slide ? "Update Slide" : "Create Slide"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

