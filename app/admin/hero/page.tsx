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
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
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
        fetchSlides();
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

  const fetchSlides = async () => {
    try {
      const response = await fetch("/api/hero");
      const data = await response.json();
      setSlides(data);
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
    return <div className={styles.loading}>Loading...</div>;
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

      <div className={styles.slidesList}>
        {slides.map((slide) => (
          <div key={slide.id} className={styles.slideCard}>
            <div className={styles.slideImages}>
              <div className={styles.imageContainer}>
                <Image
                  src={slide.mainImage}
                  alt={slide.titleEn}
                  width={200}
                  height={150}
                  className={styles.image}
                />
                <span className={styles.imageLabel}>Main Image</span>
              </div>
              <div className={styles.imageContainer}>
                <Image
                  src={slide.contentImage}
                  alt={slide.titleEn}
                  width={200}
                  height={150}
                  className={styles.image}
                />
                <span className={styles.imageLabel}>Content Image</span>
              </div>
            </div>
            <div className={styles.slideContent}>
              <h3>English</h3>
              <p><strong>Title:</strong> {slide.titleEn}</p>
              <p><strong>Description:</strong> {slide.descriptionEn.substring(0, 100)}...</p>
              <h3>Arabic</h3>
              <p><strong>Title:</strong> {slide.titleAr}</p>
              <p><strong>Description:</strong> {slide.descriptionAr.substring(0, 100)}...</p>
              <p><strong>Order:</strong> {slide.order}</p>
            </div>
            <div className={styles.slideActions}>
              <button onClick={() => handleEdit(slide)} className={styles.editButton}>
                Edit
              </button>
              <button onClick={() => handleDelete(slide.id)} className={styles.deleteButton}>
                Delete
              </button>
            </div>
          </div>
        ))}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{slide ? "Edit Slide" : "Add New Slide"}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "mainImage")}
                disabled={uploading === "mainImage"}
              />
              {formData.mainImage && (
                <Image
                  src={formData.mainImage}
                  alt="Main"
                  width={200}
                  height={150}
                  className={styles.previewImage}
                />
              )}
              {uploading === "mainImage" && <p>Uploading...</p>}
            </div>
            <div className={styles.formGroup}>
              <label>Content Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "contentImage")}
                disabled={uploading === "contentImage"}
              />
              {formData.contentImage && (
                <Image
                  src={formData.contentImage}
                  alt="Content"
                  width={200}
                  height={150}
                  className={styles.previewImage}
                />
              )}
              {uploading === "contentImage" && <p>Uploading...</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              min={0}
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {slide ? "Update" : "Create"}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

