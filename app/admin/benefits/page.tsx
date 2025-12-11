"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./benefits.module.css";

interface BenefitItem {
  id?: number;
  titleEn: string;
  titleAr: string;
  order: number;
}

interface Benefit {
  id: number;
  order: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  items: BenefitItem[];
}

export default function BenefitsAdmin() {
  const router = useRouter();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
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
        fetchBenefits();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBenefits(benefits);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = benefits.filter(
        (benefit) =>
          benefit.titleEn.toLowerCase().includes(query) ||
          benefit.titleAr.toLowerCase().includes(query) ||
          benefit.descriptionEn.toLowerCase().includes(query) ||
          benefit.descriptionAr.toLowerCase().includes(query)
      );
      setFilteredBenefits(filtered);
    }
  }, [searchQuery, benefits]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchBenefits = async () => {
    try {
      const response = await fetch("/api/benefits", { cache: "no-store" });
      const data = await response.json();
      setBenefits(data);
      setFilteredBenefits(data);
    } catch (error) {
      console.error("Error fetching benefits:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this benefit?")) return;

    try {
      const response = await fetch(`/api/benefits?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBenefits();
      } else {
        alert("Failed to delete benefit");
      }
    } catch (error) {
      console.error("Error deleting benefit:", error);
      alert("Error deleting benefit");
    }
  };

  const handleEdit = (benefit: Benefit) => {
    setEditingBenefit(benefit);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingBenefit(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading benefits...</p>
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
          <h1>Benefits Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Benefit
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
        <BenefitForm
          benefit={editingBenefit}
          onClose={() => {
            setShowForm(false);
            setEditingBenefit(null);
          }}
          onSuccess={() => {
            fetchBenefits();
            setShowForm(false);
            setEditingBenefit(null);
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
            placeholder="Search benefits..."
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
                <th>Image</th>
                <th>Title (EN)</th>
                <th>Title (AR)</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBenefits.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    {searchQuery ? "No benefits found matching your search." : "No benefits available."}
                  </td>
                </tr>
              ) : (
                filteredBenefits.map((benefit) => (
                  <tr key={benefit.id}>
                    <td>
                      <span className={styles.orderBadge}>{benefit.order}</span>
                    </td>
                    <td>
                      <div className={styles.imageCell}>
                        <Image
                          src={benefit.image}
                          alt={benefit.titleEn}
                          width={80}
                          height={60}
                          className={styles.tableImage}
                        />
                      </div>
                    </td>
                    <td className={styles.titleCell}>{benefit.titleEn}</td>
                    <td className={styles.titleCell}>{benefit.titleAr}</td>
                    <td>
                      <span className={styles.itemsCount}>{benefit.items?.length || 0} items</span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit(benefit)} className={styles.editButton}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(benefit.id)} className={styles.deleteButton}>
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

        {filteredBenefits.length > 0 && (
          <div className={styles.tableFooter}>
            Showing {filteredBenefits.length} of {benefits.length} benefit{benefits.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function BenefitForm({
  benefit,
  onClose,
  onSuccess,
}: {
  benefit: Benefit | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    titleEn: benefit?.titleEn || "",
    titleAr: benefit?.titleAr || "",
    descriptionEn: benefit?.descriptionEn || "",
    descriptionAr: benefit?.descriptionAr || "",
    image: benefit?.image || "",
    order: benefit?.order || 0,
    items: (benefit?.items || []) as BenefitItem[],
  });

  const [uploading, setUploading] = useState(false);
  const [oldImage, setOldImage] = useState(benefit?.image || "");
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("folder", "benefits");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { titleEn: "", titleAr: "", order: prev.items.length }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof BenefitItem, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/benefits";
      const method = benefit ? "PUT" : "POST";
      const body = benefit
        ? { ...formData, id: benefit.id, oldImage }
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
        alert(error.error || "Failed to save benefit");
      }
    } catch (error) {
      console.error("Error saving benefit:", error);
      alert("Error saving benefit");
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
          <h2>{benefit ? "Edit Benefit" : "Add New Benefit"}</h2>
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
              <label>Image</label>
              <div className={styles.fileUploadWrapper}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className={styles.fileInput}
                  id="imageInput"
                />
                <label htmlFor="imageInput" className={styles.fileInputLabel}>
                  {uploading ? "Uploading..." : formData.image ? "Change Image" : "Choose Image"}
                </label>
              </div>
              {formData.image && (
                <div className={styles.imagePreviewContainer}>
                  <Image
                    src={formData.image}
                    alt="Preview"
                    width={300}
                    height={200}
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label>Benefit Items</label>
              <button type="button" onClick={handleAddItem} className={styles.addItemButton}>
                + Add Item
              </button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <input
                  type="text"
                  placeholder="English title"
                  value={item.titleEn}
                  onChange={(e) => handleItemChange(index, "titleEn", e.target.value)}
                  className={styles.itemInput}
                  required
                />
                <input
                  type="text"
                  placeholder="Arabic title"
                  value={item.titleAr}
                  onChange={(e) => handleItemChange(index, "titleAr", e.target.value)}
                  className={styles.itemInput}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className={styles.removeItemButton}
                >
                  ×
                </button>
              </div>
            ))}
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
                  {benefit ? "Updating..." : "Creating..."}
                </>
              ) : (
                benefit ? "Update Benefit" : "Create Benefit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

