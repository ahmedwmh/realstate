"use client";

import React from "react";
import styles from "./footer.module.css";
import cn from "classnames";
import Logo from "../logo";
import { Heading } from "../typography";
import { Facebook, Instagram, Linkedin, Youtube } from "@/constants/icons";
import { useApiFetch } from "@/hooks/useApiFetch";
import { useLanguage } from "@/context/language-context";

export default function Footer() {
  const { language } = useLanguage();
  const { data: contact, loading } = useApiFetch<{
    taglineEn?: string;
    taglineAr?: string;
    email?: string;
    officeAddressEn?: string;
    officeAddressAr?: string;
    phone?: string;
    phone2?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  }>({
    endpoint: "/api/contact",
    cache: "no-store",
  });

  const tagline = language === "ar" ? contact?.taglineAr : contact?.taglineEn;
  const address = language === "ar" ? contact?.officeAddressAr : contact?.officeAddressEn;
  const displayPhone = contact?.phone || contact?.phone2;

  // Build social media links dynamically
  const socials = [];
  if (contact?.facebook) {
    socials.push({ icon: Facebook, url: contact.facebook, title: "Facebook", color: "#1877F2" });
  }
  if (contact?.instagram) {
    socials.push({ icon: Instagram, url: contact.instagram, title: "Instagram", color: "#E4405F" });
  }
  if (contact?.linkedin) {
    socials.push({ icon: Linkedin, url: contact.linkedin, title: "LinkedIn", color: "#0077B5" });
  }
  if (contact?.youtube) {
    socials.push({ icon: Youtube, url: contact.youtube, title: "YouTube", color: "#FF0000" });
  }

  if (loading) {
    return null;
  }

  return (
    <footer className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        {/* Top Section */}
        <div className={styles.topSection}>
          <div className={styles.logoWrapper}>
            <Logo />
          </div>

          <div className={styles.taglineSection}>
            {tagline && (
              <Heading type="heading-3" className={styles.tagline}>
                {tagline}
              </Heading>
            )}
            {contact?.email && (
              <a 
                href={`mailto:${contact.email}`}
                className={cn("subheading-small", styles.email)}
              >
                {contact.email.toUpperCase()}
              </a>
            )}
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.contactInfo}>
            {address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <div className={styles.iconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className={cn("paragraph-small", styles.contactText)}>{address}</span>
              </a>
            )}
            {displayPhone && (
              <a
                href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`}
                className={styles.contactItem}
              >
                <div className={styles.iconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className={cn("paragraph-small", styles.contactText)}>{displayPhone}</span>
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className={styles.socialsWrapper}>
              <div className={styles.socials}>
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.social}
                    aria-label={social.title}
                    style={{ '--social-color': social.color } as React.CSSProperties}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={styles.copyright}>
            <span className={cn("paragraph-small", styles.copyrightText)}>
              © {new Date().getFullYear()} Al Hulool Al Muthla. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
