"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../benefits/benefits.module.css";

interface Service {
  id: number;
  icon: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  order: number;
}

const AVAILABLE_ICONS = ["House", "TrendUp", "Building", "Bag", "BubbleChart", "DoubleBed"];

export default function ServicesAdmin() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
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
        fetchServices();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredServices(services);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = services.filter(
        (service) =>
          service.titleEn.toLowerCase().includes(query) ||
          service.titleAr.toLowerCase().includes(query) ||
          service.descriptionEn.toLowerCase().includes(query) ||
          service.descriptionAr.toLowerCase().includes(query)
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services", { cache: "no-store" });
      const data = await response.json();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await fetch(`/api/services?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices();
      } else {
        alert("Failed to delete service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Error deleting service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading services...</p>
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
          <h1>Services Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Service
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
        <ServiceForm
          service={editingService}
          onClose={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSuccess={() => {
            fetchServices();
            setShowForm(false);
            setEditingService(null);
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
            placeholder="Search services..."
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
                <th>Icon</th>
                <th>Title (EN)</th>
                <th>Title (AR)</th>
                <th>Description (EN)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    {searchQuery ? "No services found matching your search." : "No services available."}
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <span className={styles.orderBadge}>{service.order}</span>
                    </td>
                    <td>
                      <span className={styles.iconBadge}>{service.icon}</span>
                    </td>
                    <td className={styles.titleCell}>{service.titleEn}</td>
                    <td className={styles.titleCell}>{service.titleAr}</td>
                    <td className={styles.descriptionCell}>
                      {service.descriptionEn.length > 50 
                        ? `${service.descriptionEn.substring(0, 50)}...` 
                        : service.descriptionEn}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit(service)} className={styles.editButton}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(service.id)} className={styles.deleteButton}>
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

        {filteredServices.length > 0 && (
          <div className={styles.tableFooter}>
            Showing {filteredServices.length} of {services.length} service{services.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceForm({
  service,
  onClose,
  onSuccess,
}: {
  service: Service | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    icon: service?.icon || "House",
    titleEn: service?.titleEn || "",
    titleAr: service?.titleAr || "",
    descriptionEn: service?.descriptionEn || "",
    descriptionAr: service?.descriptionAr || "",
    order: service?.order || 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/services";
      const method = service ? "PUT" : "POST";
      const body = service
        ? { ...formData, id: service.id }
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
        alert(error.error || "Failed to save service");
      }
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service");
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
          <h2>{service ? "Edit Service" : "Add New Service"}</h2>
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
              <label>Icon</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                required
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
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
                  {service ? "Updating..." : "Creating..."}
                </>
              ) : (
                service ? "Update Service" : "Create Service"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

