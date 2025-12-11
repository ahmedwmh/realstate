"use client";

import React from "react";
import cn from "classnames";
import styles from "./success-message.module.css";
import { createPortal } from "react-dom";

type SuccessMessageProps = {
  visible: boolean;
  onClose: () => void;
  message?: string;
  language?: "en" | "ar";
};

export default function SuccessMessage({
  visible,
  onClose,
  message,
  language = "en",
}: SuccessMessageProps) {
  React.useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "auto";
      };
    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const defaultMessage =
    language === "ar" ? "تم إرسال الرسالة بنجاح!" : "Message sent successfully!";

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconContainer}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.checkIcon}
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className={styles.title}>
          {language === "ar" ? "تم بنجاح!" : "Success!"}
        </h3>
        <p className={styles.message}>{message || defaultMessage}</p>
        <button
          className={cn("button", styles.closeButton)}
          onClick={onClose}
          aria-label={language === "ar" ? "إغلاق" : "Close"}
        >
          {language === "ar" ? "حسناً" : "OK"}
        </button>
      </div>
    </div>,
    document.body
  );
}

