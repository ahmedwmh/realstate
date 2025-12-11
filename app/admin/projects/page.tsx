"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./projects.module.css";

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
  generalInfo?: any;
  interiorDetails?: any;
}

export default function ProjectsAdmin() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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
        fetchProjects();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = projects.filter(
        (project) =>
          project.titleEn.toLowerCase().includes(query) ||
          project.titleAr.toLowerCase().includes(query) ||
          project.descriptionEn.toLowerCase().includes(query) ||
          project.descriptionAr.toLowerCase().includes(query) ||
          project.category.toLowerCase().includes(query) ||
          (project.address && project.address.toLowerCase().includes(query))
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProjects();
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
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
          <h1>Projects Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Project
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
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            fetchProjects();
            setShowForm(false);
            setEditingProject(null);
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
            placeholder="Search projects by title, description, category, or address..."
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
                <th>ID</th>
                <th>Image</th>
                <th>Title (EN)</th>
                <th>Title (AR)</th>
                <th>Category</th>
                <th>Address</th>
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    {searchQuery ? "No projects found matching your search." : "No projects available."}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>
                      {project.images && project.images.length > 0 ? (
                        <div className={styles.imageCell}>
                          <Image
                            src={project.images[0]}
                            alt={project.titleEn}
                            width={60}
                            height={60}
                            className={styles.tableImage}
                          />
                        </div>
                      ) : (
                        <div className={styles.noImage}>No image</div>
                      )}
                    </td>
                    <td className={styles.titleCell}>{project.titleEn}</td>
                    <td className={styles.titleCell}>{project.titleAr}</td>
                    <td>
                      <span className={styles.categoryBadge}>{project.category}</span>
                    </td>
                    <td className={styles.addressCell}>{project.address || "-"}</td>
                    <td>
                      <span className={styles.imageCount}>{project.images?.length || 0}</span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit(project)} className={styles.editButton}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(project.id)} className={styles.deleteButton}>
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

        {filteredProjects.length > 0 && (
          <div className={styles.tableFooter}>
            Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectForm({
  project,
  onClose,
  onSuccess,
}: {
  project: Project | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    titleEn: project?.titleEn || "",
    titleAr: project?.titleAr || "",
    descriptionEn: project?.descriptionEn || "",
    descriptionAr: project?.descriptionAr || "",
    category: project?.category || "",
    address: project?.address || "",
    images: project?.images || [] as string[],
    features: project?.features || null,
    generalInfo: project?.generalInfo || { itemsEn: [""], itemsAr: [""] },
    interiorDetails: project?.interiorDetails || { itemsEn: [""], itemsAr: [""] },
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [oldImages, setOldImages] = useState<string[]>(project?.images || []);

  const categories = ["Houses", "Townhouses", "Condos", "Villas", "Commercial"];

  const MAX_IMAGES = 15;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImageCount = formData.images.length;
    const remainingSlots = MAX_IMAGES - currentImageCount;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${MAX_IMAGES} images allowed. Please remove some images first.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      alert(`Only ${remainingSlots} image(s) can be added. Maximum ${MAX_IMAGES} images allowed.`);
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "projects");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        const data = await response.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/projects";
      const method = project ? "PUT" : "POST";
      const body = project
        ? { ...formData, id: project.id, oldImages }
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
        alert(error.error || "Failed to save project");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Error saving project");
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{project ? "Edit Project" : "Add New Project"}</h2>
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
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <label>Images (Max {MAX_IMAGES})</label>
              <span style={{ fontSize: "0.875rem", color: formData.images.length >= MAX_IMAGES ? "#dc3545" : "var(--gray-600)" }}>
                {formData.images.length} / {MAX_IMAGES}
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={uploading || formData.images.length >= MAX_IMAGES}
            />
            {uploading && <p style={{ marginTop: "0.5rem", color: "var(--gray-600)" }}>Uploading...</p>}
            {formData.images.length >= MAX_IMAGES && (
              <p style={{ marginTop: "0.5rem", color: "#dc3545", fontSize: "0.875rem" }}>
                Maximum {MAX_IMAGES} images reached. Remove images to add more.
              </p>
            )}
            {formData.images.length > 0 && (
              <div className={styles.imagesGrid}>
                {formData.images.map((img, idx) => (
                  <div key={idx} className={styles.imagePreview}>
                    <Image
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      width={100}
                      height={100}
                      className={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className={styles.removeImageButton}
                      title="Remove image"
                    >
                      ×
                    </button>
                    <div className={styles.imageNumber}>{idx + 1}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* General Information Section */}
          <div className={styles.formGroup}>
            <label style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", display: "block" }}>
              General Information (معلومات عامة)
            </label>
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label>English Items (one per line)</label>
                <textarea
                  value={Array.isArray(formData.generalInfo?.itemsEn) ? formData.generalInfo.itemsEn.join('\n') : (formData.generalInfo?.itemsEn || '')}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter(item => item.trim() !== '');
                    setFormData({
                      ...formData,
                      generalInfo: {
                        ...formData.generalInfo,
                        itemsEn: items.length > 0 ? items : [''],
                        itemsAr: formData.generalInfo?.itemsAr || ['']
                      }
                    });
                  }}
                  rows={6}
                  placeholder="Enter each item on a new line"
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label>Arabic Items (عنصر واحد في كل سطر)</label>
                <textarea
                  value={Array.isArray(formData.generalInfo?.itemsAr) ? formData.generalInfo.itemsAr.join('\n') : (formData.generalInfo?.itemsAr || '')}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter(item => item.trim() !== '');
                    setFormData({
                      ...formData,
                      generalInfo: {
                        ...formData.generalInfo,
                        itemsEn: formData.generalInfo?.itemsEn || [''],
                        itemsAr: items.length > 0 ? items : ['']
                      }
                    });
                  }}
                  rows={6}
                  placeholder="أدخل كل عنصر في سطر جديد"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Interior Details Section */}
          <div className={styles.formGroup}>
            <label style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem", display: "block" }}>
              Interior Details (تفاصيل داخلية)
            </label>
            <div className={styles.formRow}>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label>English Items (one per line)</label>
                <textarea
                  value={Array.isArray(formData.interiorDetails?.itemsEn) ? formData.interiorDetails.itemsEn.join('\n') : (formData.interiorDetails?.itemsEn || '')}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter(item => item.trim() !== '');
                    setFormData({
                      ...formData,
                      interiorDetails: {
                        ...formData.interiorDetails,
                        itemsEn: items.length > 0 ? items : [''],
                        itemsAr: formData.interiorDetails?.itemsAr || ['']
                      }
                    });
                  }}
                  rows={6}
                  placeholder="Enter each item on a new line"
                />
              </div>
              <div className={styles.formGroup} style={{ flex: 1 }}>
                <label>Arabic Items (عنصر واحد في كل سطر)</label>
                <textarea
                  value={Array.isArray(formData.interiorDetails?.itemsAr) ? formData.interiorDetails.itemsAr.join('\n') : (formData.interiorDetails?.itemsAr || '')}
                  onChange={(e) => {
                    const items = e.target.value.split('\n').filter(item => item.trim() !== '');
                    setFormData({
                      ...formData,
                      interiorDetails: {
                        ...formData.interiorDetails,
                        itemsEn: formData.interiorDetails?.itemsEn || [''],
                        itemsAr: items.length > 0 ? items : ['']
                      }
                    });
                  }}
                  rows={6}
                  placeholder="أدخل كل عنصر في سطر جديد"
                  dir="rtl"
                />
              </div>
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
                  {project ? "Updating..." : "Creating..."}
                </>
              ) : uploading ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  Uploading Images...
                </>
              ) : (
                project ? "Update Project" : "Create Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

