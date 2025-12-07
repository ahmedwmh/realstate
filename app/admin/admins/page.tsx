"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./admins.module.css";

interface Admin {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export default function AdminsAdmin() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
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
        if (data.user.role !== "super_admin") {
          router.push("/admin");
          return;
        }
        setCurrentUser(data.user);
        fetchAdmins();
      } catch (error) {
        router.push("/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins");
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const response = await fetch(`/api/admins?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAdmins();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin");
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAdmin(null);
    setShowForm(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
          <h1>Admins Management</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add New Admin
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
        <AdminForm
          admin={editingAdmin}
          onClose={() => {
            setShowForm(false);
            setEditingAdmin(null);
          }}
          onSuccess={() => {
            fetchAdmins();
            setShowForm(false);
            setEditingAdmin(null);
          }}
        />
      )}

      <div className={styles.adminsList}>
        {admins.map((admin) => (
          <div key={admin.id} className={styles.adminCard}>
            <div className={styles.adminContent}>
              <div>
                <h3>{admin.name || admin.email}</h3>
                <p className={styles.email}>{admin.email}</p>
                <div className={styles.badge}>
                  <span className={admin.role === "super_admin" ? styles.superAdmin : styles.admin}>
                    {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                  </span>
                </div>
                <p className={styles.date}>
                  Created: {new Date(admin.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className={styles.adminActions}>
              <button onClick={() => handleEdit(admin)} className={styles.editButton}>
                Edit
              </button>
              {admin.id !== currentUser?.id && (
                <button onClick={() => handleDelete(admin.id)} className={styles.deleteButton}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminForm({
  admin,
  onClose,
  onSuccess,
}: {
  admin: Admin | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    email: admin?.email || "",
    password: "",
    name: admin?.name || "",
    role: admin?.role || "admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = "/api/admins";
      const method = admin ? "PUT" : "POST";
      const body = admin
        ? { ...formData, id: admin.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to save admin");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
      setError("Error saving admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>{admin ? "Edit Admin" : "Add New Admin"}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={!!admin}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password {admin && "(leave empty to keep current)"}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!admin}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton} disabled={loading}>
              {loading ? "Saving..." : admin ? "Update" : "Create"}
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

