import React from "react";
import styles from "./video-player.module.css";

type VideoPlayerProps = {
  src: string;
};

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

export default function VideoPlayer({ src }: VideoPlayerProps) {
  const embedUrl = convertToEmbedUrl(src);
  
  if (!embedUrl) {
    return <div className={styles.error}>Invalid video URL</div>;
  }
  
  return (
    <div className={styles.video}>
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  );
}
