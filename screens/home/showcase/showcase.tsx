"use client";

import React from "react";
import styles from "./showcase.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import Image from "next/image";
import { Play } from "@/constants/icons";
import Modal from "@/components/modal";
import VideoPlayer from "@/components/video-player";
import { useLanguage } from "@/context/language-context";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { Showcase } from "@/types";

// Utility function to convert YouTube URLs to embed format
const convertToEmbedUrl = (url: string): string => {
  if (!url) return url;
  
  // Already an embed URL
  if (url.includes('/embed/')) {
    return url;
  }
  
  // YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }
  
  // Return as-is if no match (might be other video platform)
  return url;
};

// Stable transform function to prevent re-renders
const transformShowcase = (data: any): Showcase => {
  if (!data) {
    // Return a default Showcase object if data is null/undefined
    return {
      id: 0,
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      thumbnailImage: "",
      videoUrl: "",
    };
  }
  return {
    ...data,
    videoUrl: convertToEmbedUrl(data.videoUrl),
  };
};

function Showcase() {
  const { language } = useLanguage();
  const [visible, setVisible] = React.useState(false);
  const { data: showcaseData, loading } = useApiFetch<Showcase>({
    endpoint: "/api/showcase",
    cache: "no-store",
    transform: transformShowcase,
  });

  if (loading) {
    return (
      <section className={cn("section")}>
        <div className={cn("container")}>
          <div className={styles.content}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonDescription} />
            <div className={styles.skeletonDescription} style={{ width: "80%" }} />
          </div>
          <div className={styles.video_wrapper}>
            <div className={styles.skeletonVideo} />
          </div>
        </div>
      </section>
    );
  }

  if (!showcaseData) {
    return null;
  }

  const title = language === "ar" ? showcaseData.titleAr : showcaseData.titleEn;
  const description = language === "ar" ? showcaseData.descriptionAr : showcaseData.descriptionEn;

  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={styles.content}>
          <Heading type="heading-3">{title}</Heading>
          <div className={cn("paragraph-large", styles.subtitle)}>{description}</div>
        </div>

        <div className={styles.video_wrapper}>
          {showcaseData.thumbnailImage && (
          <Image
              src={showcaseData.thumbnailImage}
              fill
              style={{ objectFit: "cover" }}
              alt={title}
              sizes="(max-width: 768px) 100vw, 100vw"
              unoptimized={showcaseData.thumbnailImage?.startsWith("http") || false}
              loading="lazy"
          />
          )}

          <div className={styles.play_button} onClick={() => setVisible(true)}>
            {Play}
          </div>

          <Modal visible={visible} onClose={() => setVisible(false)}>
            <VideoPlayer src={showcaseData.videoUrl} />
          </Modal>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Showcase);
