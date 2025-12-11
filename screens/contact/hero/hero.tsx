"use client";

import React, { useState } from "react";
import styles from "./hero.module.css";
import cn from "classnames";
import { TextArea, TextField } from "@/components/elements";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";
import SuccessMessage from "@/components/success-message/success-message";

interface ContactData {
  id?: number;
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
}

// Stable transform function
const transformContact = (data: any): ContactData => {
  return data || {
    titleEn: "Get In Touch",
    titleAr: "تواصل معنا",
    descriptionEn: "We'd love to hear from you! Whether you have a question about our listings, services, or just want to talk about your dream home, our team is here to help.",
    descriptionAr: "نود أن نسمع منك! سواء كان لديك سؤال حول قوائمنا أو خدماتنا، أو تريد فقط التحدث عن منزل أحلامك، فريقنا هنا لمساعدتك.",
    officeAddressEn: "",
    officeAddressAr: "",
    phone: "",
    phone2: "",
    email: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  };
};

export default function Hero() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: contactData, loading } = useApiFetch<ContactData>({
    endpoint: "/api/contact",
    cache: "no-store",
    transform: transformContact,
  });

  const contact = React.useMemo(() => {
    return contactData || transformContact(null);
  }, [contactData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setFormData({ firstName: "", lastName: "", phone: "", message: "" });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(language === "ar" ? "حدث خطأ أثناء إرسال الرسالة" : "Error sending message");
    } finally {
      setSubmitting(false);
    }
  };

  const title = language === "ar" ? contact.titleAr : contact.titleEn;
  const description = language === "ar" ? contact.descriptionAr : contact.descriptionEn;
  const officeAddress = language === "ar" ? contact.officeAddressAr : contact.officeAddressEn;

  if (loading) {
    return (
      <section className={cn("section", styles.section)}>
        <div className={cn("container")}>
          <div className={styles.skeleton}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonDescription} />
            <div className={styles.skeletonDescription} style={{ width: "80%" }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container")}>
        <div className={styles.information}>
          <div className={styles.column}>
            <div className={cn("heading-6", styles.title)}>{title}</div>
            {description && (
              <div className={cn("paragraph-medium", styles.subtitle)}>
                {description}
              </div>
            )}
          </div>

          {(officeAddress || contact.phone || contact.phone2 || contact.email || contact.facebook || contact.instagram || contact.whatsapp) && (
            <>
              <div className={styles.divider} />

              <div className={styles.contact}>
                {officeAddress && (
                  <div>
                    <div className={cn("subheading-medium", styles.contact_title)}>
                      {language === "ar" ? "المكتب" : "OFFICE"}
                    </div>
                    <div className={cn("paragraph-medium", styles.contact_text)}>
                      {officeAddress}
                    </div>
                  </div>
                )}

                {(contact.phone || contact.phone2 || contact.email || contact.facebook || contact.instagram || contact.whatsapp) && (
                  <div>
                    <div className={cn("subheading-medium", styles.contact_title)}>
                      {language === "ar" ? "اتصل بنا" : "CONTACT"}
                    </div>
                    {contact.phone && (
                      <div className={cn("paragraph-medium", styles.contact_text)}>
                        <a href={`tel:${contact.phone}`} className={styles.contact_link}>
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.phone2 && (
                      <div className={cn("paragraph-medium", styles.contact_text)}>
                        <a href={`tel:${contact.phone2}`} className={styles.contact_link}>
                          {contact.phone2}
                        </a>
                      </div>
                    )}
                    {contact.email && (
                      <div className={cn("paragraph-medium", styles.contact_text)}>
                        <a href={`mailto:${contact.email}`} className={styles.contact_link}>
                          {contact.email}
                        </a>
                      </div>
                    )}
                    {(contact.facebook || contact.instagram || contact.whatsapp) && (
                      <div className={styles.socialLinks}>
                        {contact.facebook && (
                          <a
                            href={contact.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Facebook"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                          </a>
                        )}
                        {contact.instagram && (
                          <a
                            href={contact.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="Instagram"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </a>
                        )}
                        {contact.whatsapp && (
                          <a
                            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.socialLink}
                            aria-label="WhatsApp"
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.rowFields}>
            <TextField
              name="firstName"
              type="text"
              placeholder={language === "ar" ? "الاسم الأول" : "First Name"}
              required
              value={formData.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <TextField
              name="lastName"
              type="text"
              placeholder={language === "ar" ? "اسم العائلة" : "Last Name"}
              required
              value={formData.lastName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <TextField
            name="phone"
            type="tel"
            placeholder={language === "ar" ? "رقم الهاتف" : "Phone Number"}
            required
            value={formData.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
          />

          <TextArea
            name="message"
            placeholder={language === "ar" ? "رسالتك..." : "Your Message..."}
            required
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
          />
          <div className={styles.formActions}>
            <button
              type="submit"
              className={cn("button", styles.button)}
              disabled={submitting}
            >
              {submitting
                ? language === "ar"
                  ? "جاري الإرسال..."
                  : "Sending..."
                : language === "ar"
                ? "إرسال"
                : "Send"}
            </button>
          </div>
        </form>
      </div>

      <SuccessMessage
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        language={language}
        message={
          language === "ar"
            ? "تم إرسال الرسالة بنجاح! سنتواصل معك قريباً."
            : "Message sent successfully! We'll get back to you soon."
        }
      />
    </section>
  );
}
