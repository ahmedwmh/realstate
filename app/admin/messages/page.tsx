"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import styles from "../benefits/benefits.module.css";

interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MessagesAdmin() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = React.useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === "all" 
        ? "/api/contact-messages" 
        : `/api/contact-messages?isRead=${filter === "read"}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const markAsRead = async (id: number, isRead: boolean) => {
    try {
      const response = await fetch("/api/contact-messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead }),
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead });
        }
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/contact-messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm(language === "ar" ? "هل أنت متأكد من حذف هذه الرسالة؟" : "Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contact-messages?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === "ar") {
      // Format: DD/MM/YYYY HH:MM
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>{language === "ar" ? "جاري التحميل..." : "Loading..."}</p>
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
          <h1>{language === "ar" ? "رسائل العملاء" : "Contact Messages"}</h1>
          {unreadCount > 0 && (
            <span className={styles.badge}>
              {unreadCount} {language === "ar" ? "غير مقروء" : "unread"}
            </span>
          )}
        </div>
        <div className={styles.headerRight}>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className={styles.addButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {language === "ar" ? "تعليم الكل كمقروء" : "Mark All as Read"}
            </button>
          )}
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

      <div className={styles.filters}>
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? styles.filterActive : styles.filterButton}
        >
          {language === "ar" ? "الكل" : "All"} ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={filter === "unread" ? styles.filterActive : styles.filterButton}
        >
          {language === "ar" ? "غير مقروء" : "Unread"} ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          className={filter === "read" ? styles.filterActive : styles.filterButton}
        >
          {language === "ar" ? "مقروء" : "Read"} ({messages.length - unreadCount})
        </button>
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{language === "ar" ? "الحالة" : "Status"}</th>
                <th>{language === "ar" ? "الاسم" : "Name"}</th>
                <th>{language === "ar" ? "الهاتف" : "Phone"}</th>
                <th>{language === "ar" ? "الرسالة" : "Message"}</th>
                <th>{language === "ar" ? "التاريخ" : "Date"}</th>
                <th>{language === "ar" ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    {language === "ar" ? "لا توجد رسائل" : "No messages found"}
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr
                    key={message.id}
                    className={!message.isRead ? styles.unreadRow : ""}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        markAsRead(message.id, true);
                      }
                    }}
                  >
                    <td>
                      {!message.isRead ? (
                        <span className={styles.unreadBadge}>
                          {language === "ar" ? "جديد" : "New"}
                        </span>
                      ) : (
                        <span className={styles.readBadge}>
                          {language === "ar" ? "مقروء" : "Read"}
                        </span>
                      )}
                    </td>
                    <td className={styles.nameCell}>
                      {message.firstName} {message.lastName}
                    </td>
                    <td>
                      <a
                        href={`tel:${message.phone}`}
                        className={styles.phoneLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {message.phone}
                      </a>
                    </td>
                    <td className={styles.messageCell}>
                      {message.message.length > 100
                        ? `${message.message.substring(0, 100)}...`
                        : message.message}
                    </td>
                    <td className={styles.dateCell}>{formatDate(message.createdAt)}</td>
                    <td>
                      <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`tel:${message.phone}`}
                          className={styles.actionButton}
                          title={language === "ar" ? "اتصل" : "Call"}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </a>
                        {!message.isRead && (
                          <button
                            className={styles.actionButton}
                            onClick={() => markAsRead(message.id, true)}
                            title={language === "ar" ? "تعليم كمقروء" : "Mark as Read"}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                              <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                          </button>
                        )}
                        <button
                          className={styles.deleteButton}
                          onClick={() => deleteMessage(message.id)}
                          title={language === "ar" ? "حذف" : "Delete"}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onMarkAsRead={(isRead) => markAsRead(selectedMessage.id, isRead)}
          onDelete={() => {
            deleteMessage(selectedMessage.id);
            setSelectedMessage(null);
          }}
          language={language}
        />
      )}
    </div>
  );
}

function MessageModal({
  message,
  onClose,
  onMarkAsRead,
  onDelete,
  language,
}: {
  message: ContactMessage;
  onClose: () => void;
  onMarkAsRead: (isRead: boolean) => void;
  onDelete: () => void;
  language: string;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (language === "ar") {
      // Format: DD/MM/YYYY HH:MM
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2>
              {message.firstName} {message.lastName}
            </h2>
            <div className={styles.modalMeta}>
              <a href={`tel:${message.phone}`} className={styles.phoneLink}>
                {message.phone}
              </a>
              <span className={styles.modalDate}>{formatDate(message.createdAt)}</span>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.messageContent}>
            <p>{message.message}</p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <a
            href={`tel:${message.phone}`}
            className={styles.modalButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {language === "ar" ? "اتصل" : "Call"}
          </a>
          {!message.isRead && (
            <button
              className={styles.modalButton}
              onClick={() => onMarkAsRead(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              {language === "ar" ? "تعليم كمقروء" : "Mark as Read"}
            </button>
          )}
          <button
            className={styles.deleteButton}
            onClick={onDelete}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            {language === "ar" ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

