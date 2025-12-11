"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../benefits/benefits.module.css";

interface Fact {
  id: number;
  icon: string;
  title: string;
  descriptionEn: string;
  descriptionAr: string;
  order: number;
}

const AVAILABLE_ICONS = ["HappyHeart", "Building", "Medal"];

export default function FactsAdmin() {
  const router = useRouter();
  const [facts, setFacts] = useState<Fact[]>([]);
  const [filteredFacts, setFilteredFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFact, setEditingFact] = useState<Fact | null>(null);
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
        fetchFacts();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFacts(facts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = facts.filter(
        (fact) =>
          fact.title.toLowerCase().includes(query) ||
          fact.descriptionEn.toLowerCase().includes(query) ||
          fact.descriptionAr.toLowerCase().includes(query)
      );
      setFilteredFacts(filtered);
    }
  }, [searchQuery, facts]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchFacts = async () => {
    try {
      const response = await fetch("/api/facts", { cache: "no-store" });
      const data = await response.json();
      setFacts(data);
      setFilteredFacts(data);
    } catch (error) {
      console.error("Error fetching facts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this fact?")) return;

    try {
      const response = await fetch(`/api/facts?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchFacts();
      } else {
        alert("Failed to delete fact");
      }
    } catch (error) {
      console.error("Error deleting fact:", error);
      alert("Error deleting fact");
    }
  };

  const handleEdit = (fact: Fact) => {
    setEditingFact(fact);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingFact(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading facts...</p>
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
          <h1>Facts Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Fact
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
        <FactForm
          fact={editingFact}
          onClose={() => {
            setShowForm(false);
            setEditingFact(null);
          }}
          onSuccess={() => {
            fetchFacts();
            setShowForm(false);
            setEditingFact(null);
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
            placeholder="Search facts..."
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
                <th>Title</th>
                <th>Description (EN)</th>
                <th>Description (AR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    {searchQuery ? "No facts found matching your search." : "No facts available."}
                  </td>
                </tr>
              ) : (
                filteredFacts.map((fact) => (
                  <tr key={fact.id}>
                    <td>
                      <span className={styles.orderBadge}>{fact.order}</span>
                    </td>
                    <td>
                      <span className={styles.iconBadge}>{fact.icon}</span>
                    </td>
                    <td className={styles.titleCell}>{fact.title}</td>
                    <td className={styles.descriptionCell}>
                      {fact.descriptionEn.length > 50 
                        ? `${fact.descriptionEn.substring(0, 50)}...` 
                        : fact.descriptionEn}
                    </td>
                    <td className={styles.descriptionCell}>
                      {fact.descriptionAr.length > 50 
                        ? `${fact.descriptionAr.substring(0, 50)}...` 
                        : fact.descriptionAr}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit(fact)} className={styles.editButton}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(fact.id)} className={styles.deleteButton}>
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

        {filteredFacts.length > 0 && (
          <div className={styles.tableFooter}>
            Showing {filteredFacts.length} of {facts.length} fact{facts.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function FactForm({
  fact,
  onClose,
  onSuccess,
}: {
  fact: Fact | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    icon: fact?.icon || "HappyHeart",
    title: fact?.title || "",
    descriptionEn: fact?.descriptionEn || "",
    descriptionAr: fact?.descriptionAr || "",
    order: fact?.order || 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/facts";
      const method = fact ? "PUT" : "POST";
      const body = fact
        ? { ...formData, id: fact.id }
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
        alert(error.error || "Failed to save fact");
      }
    } catch (error) {
      console.error("Error saving fact:", error);
      alert("Error saving fact");
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
          <h2>{fact ? "Edit Fact" : "Add New Fact"}</h2>
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
              <label>Title (Number/Text)</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., 98%, 300+, 15"
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

          <div className={styles.formGroup}>
            <label>Display Order</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              min={0}
            />
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
                  {fact ? "Updating..." : "Creating..."}
                </>
              ) : (
                fact ? "Update Fact" : "Create Fact"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

