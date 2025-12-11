"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import styles from "../benefits/benefits.module.css";

interface Contact {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  officeAddressEn: string;
  officeAddressAr: string;
  phone: string;
  phone2?: string;
  email: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  linkedin?: string;
  youtube?: string;
  taglineEn?: string;
  taglineAr?: string;
}

export default function ContactAdmin() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const officeAddress = contact ? (language === "ar" ? contact.officeAddressAr : contact.officeAddressEn) : "";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (!data.authenticated) {
          router.push("/admin/login");
          return;
        }
        fetchContact();
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

  const fetchContact = async () => {
    try {
      const response = await fetch("/api/contact", { cache: "no-store" });
      const data = await response.json();
      if (data.id) {
        setContact(data);
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
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
        <p>{t("admin.contact.loading") || "Loading..."}</p>
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
            {t("admin.dashboard.title") || "Dashboard"}
          </Link>
          <h1>{t("admin.contact.title") || "Contact Management"}</h1>
        </div>
        <div className={styles.headerRight}>
          <button onClick={contact ? handleEdit : handleAddNew} className={styles.addButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {contact
              ? t("admin.contact.edit") || "Edit Contact"
              : t("admin.contact.add") || "Add Contact"}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t("admin.dashboard.logout") || "Logout"}
          </button>
        </div>
      </div>

      {showForm && (
        <ContactForm
          contact={contact}
          onClose={() => {
            setShowForm(false);
          }}
          onSuccess={() => {
            fetchContact();
            setShowForm(false);
          }}
        />
      )}

      {contact && (
        <div className={styles.tableContainer}>
          <div className={styles.contactCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h2 className={styles.cardTitle}>{language === "ar" ? contact.titleAr : contact.titleEn}</h2>
                <p className={styles.cardSubtitle}>{language === "ar" ? "معلومات الاتصال" : "Contact Information"}</p>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>{language === "ar" ? "الوصف" : "Description"}</h3>
                <p className={styles.sectionText}>{language === "ar" ? contact.descriptionAr : contact.descriptionEn}</p>
              </div>

              <div className={styles.infoGrid}>
                {officeAddress && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>{language === "ar" ? "عنوان المكتب" : "Office Address"}</div>
                      <div className={styles.infoValue}>{language === "ar" ? contact.officeAddressAr : contact.officeAddressEn}</div>
                    </div>
                  </div>
                )}

                {contact.phone && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>{language === "ar" ? "الهاتف" : "Phone"}</div>
                      <a href={`tel:${contact.phone}`} className={styles.infoLink}>{contact.phone}</a>
                    </div>
                  </div>
                )}

                {contact.phone2 && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>{language === "ar" ? "الهاتف 2" : "Phone 2"}</div>
                      <a href={`tel:${contact.phone2}`} className={styles.infoLink}>{contact.phone2}</a>
                    </div>
                  </div>
                )}

                {contact.email && (
                  <div className={styles.infoCard}>
                    <div className={styles.infoIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                    <div className={styles.infoContent}>
                      <div className={styles.infoLabel}>{language === "ar" ? "البريد الإلكتروني" : "Email"}</div>
                      <a href={`mailto:${contact.email}`} className={styles.infoLink}>{contact.email}</a>
                    </div>
                  </div>
                )}
              </div>

              {(contact.facebook || contact.instagram || contact.whatsapp) && (
                <div className={styles.socialSection}>
                  <h3 className={styles.sectionTitle}>{language === "ar" ? "وسائل التواصل الاجتماعي" : "Social Media"}</h3>
                  <div className={styles.socialGrid}>
                    {contact.facebook && (
                      <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                        <div className={styles.socialIcon} style={{ background: "linear-gradient(135deg, #1877F2 0%, #0C63D4 100%)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                          </svg>
                        </div>
                        <div className={styles.socialContent}>
                          <div className={styles.socialLabel}>Facebook</div>
                          <div className={styles.socialUrl}>View Page</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.externalIcon}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}

                    {contact.instagram && (
                      <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                        <div className={styles.socialIcon} style={{ background: "linear-gradient(135deg, #E4405F 0%, #C13584 50%, #833AB4 100%)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                        </div>
                        <div className={styles.socialContent}>
                          <div className={styles.socialLabel}>Instagram</div>
                          <div className={styles.socialUrl}>View Profile</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.externalIcon}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}

                    {contact.whatsapp && (
                      <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                        <div className={styles.socialIcon} style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </div>
                        <div className={styles.socialContent}>
                          <div className={styles.socialLabel}>WhatsApp</div>
                          <div className={styles.socialUrl}>+{contact.whatsapp}</div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.externalIcon}>
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!contact && (
        <div className={styles.tableContainer}>
          <div className={styles.noData}>
            {t("admin.contact.noData") || "No contact information configured. Click 'Add Contact' to create one."}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactForm({
  contact,
  onClose,
  onSuccess,
}: {
  contact: Contact | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    titleEn: contact?.titleEn || "",
    titleAr: contact?.titleAr || "",
    descriptionEn: contact?.descriptionEn || "",
    descriptionAr: contact?.descriptionAr || "",
    officeAddressEn: contact?.officeAddressEn || "",
    officeAddressAr: contact?.officeAddressAr || "",
    phone: contact?.phone || "",
    phone2: contact?.phone2 || "",
    email: contact?.email || "",
    facebook: contact?.facebook || "",
    instagram: contact?.instagram || "",
    whatsapp: contact?.whatsapp || "",
    linkedin: contact?.linkedin || "",
    youtube: contact?.youtube || "",
    taglineEn: contact?.taglineEn || "",
    taglineAr: contact?.taglineAr || "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = "/api/contact";
      const method = contact ? "PUT" : "POST";
      
      // Prepare body with proper data types
      const body = contact 
        ? { 
            ...formData, 
            id: contact.id,
            // Ensure empty strings are converted to null for optional fields
            phone2: formData.phone2?.trim() || null,
            facebook: formData.facebook?.trim() || null,
            instagram: formData.instagram?.trim() || null,
            whatsapp: formData.whatsapp?.trim() || null,
            linkedin: formData.linkedin?.trim() || null,
            youtube: formData.youtube?.trim() || null,
            taglineEn: formData.taglineEn?.trim() || null,
            taglineAr: formData.taglineAr?.trim() || null,
          }
        : {
            ...formData,
            phone2: formData.phone2?.trim() || null,
            facebook: formData.facebook?.trim() || null,
            instagram: formData.instagram?.trim() || null,
            whatsapp: formData.whatsapp?.trim() || null,
            linkedin: formData.linkedin?.trim() || null,
            youtube: formData.youtube?.trim() || null,
            taglineEn: formData.taglineEn?.trim() || null,
            taglineAr: formData.taglineAr?.trim() || null,
          };

      console.log("Submitting contact data:", { method, body });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        console.error("Error response:", responseData);
        
        // Handle validation errors
        if (responseData.validationErrors && Array.isArray(responseData.validationErrors)) {
          const errorMessage = responseData.error + ":\n\n" + responseData.validationErrors.join("\n");
          alert(errorMessage);
        } else {
          const errorMessage = responseData.error || responseData.details || t("admin.contact.saveError") || "Failed to save contact";
          alert(errorMessage);
        }
        setSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error saving contact:", error);
      const errorMessage = error.message || t("admin.contact.saveError") || "Failed to save contact. Please check your connection and try again.";
      alert(errorMessage);
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
          <h2>
            {contact
              ? t("admin.contact.editContact") || "Edit Contact"
              : t("admin.contact.addContact") || "Add New Contact"}
          </h2>
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
              <label>{t("admin.contact.titleEn") || "English Title"}</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.titleAr") || "Arabic Title"}</label>
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
              <label>{t("admin.contact.descriptionEn") || "English Description"}</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                required
                rows={4}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.descriptionAr") || "Arabic Description"}</label>
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
              <label>{t("admin.contact.officeAddressEn") || "Office Address (English)"}</label>
              <input
                type="text"
                value={formData.officeAddressEn}
                onChange={(e) => setFormData({ ...formData, officeAddressEn: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.officeAddressAr") || "Office Address (Arabic)"}</label>
              <input
                type="text"
                value={formData.officeAddressAr}
                onChange={(e) => setFormData({ ...formData, officeAddressAr: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.phone") || "Phone"}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.phone2") || "Phone 2 (Optional)"}</label>
              <input
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                placeholder={t("admin.contact.phone2Placeholder") || "Additional phone number"}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.email") || "Email"}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.facebook") || "Facebook URL (Optional)"}</label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.instagram") || "Instagram URL (Optional)"}</label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/yourpage"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.whatsapp") || "WhatsApp Number (Optional)"}</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder={t("admin.contact.whatsappPlaceholder") || "e.g., 966501234567"}
              />
              <div style={{ fontSize: "0.875rem", color: "var(--slate-500)", marginTop: "4px" }}>
                {t("admin.contact.whatsappHelp") || "Enter phone number with country code (without +)"}
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.linkedin") || "LinkedIn URL (Optional)"}</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.youtube") || "YouTube URL (Optional)"}</label>
              <input
                type="url"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.taglineEn") || "Footer Tagline (English)"}</label>
              <input
                type="text"
                value={formData.taglineEn}
                onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                placeholder="Building Dreams, One Home at a Time."
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t("admin.contact.taglineAr") || "Footer Tagline (Arabic)"}</label>
              <input
                type="text"
                value={formData.taglineAr}
                onChange={(e) => setFormData({ ...formData, taglineAr: e.target.value })}
                placeholder="بناء الأحلام، منزل واحد في كل مرة."
                dir="rtl"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? (
                <>
                  <svg className={styles.buttonSpinner} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v4" />
                  </svg>
                  {t("admin.contact.saving") || "Saving..."}
                </>
              ) : (
                contact
                  ? t("admin.news.update") || "Update"
                  : t("admin.news.create") || "Create"
              )}
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              {t("admin.news.cancel") || "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

