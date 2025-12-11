"use client";

import React from "react";
import styles from "./gallery.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import Image from "next/image";
import Modal from "@/components/modal";
import { useLanguage } from "@/context/language-context";

type GalleryProps = {
  images: string[];
  title: string;
};

export default function Gallery({ images, title }: GalleryProps) {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleNext = () => {
    const nextIndex = (selectedIndex + 1) % images.length;
    setSelectedIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (selectedIndex - 1 + images.length) % images.length;
    setSelectedIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  // Group images for masonry layout
  const getImageGroups = () => {
    const groups: { images: string[]; indices: number[] }[] = [{ images: [], indices: [] }, { images: [], indices: [] }];
    images.forEach((img, index) => {
      const groupIndex = index % 2;
      groups[groupIndex].images.push(img);
      groups[groupIndex].indices.push(index);
    });
    return groups;
  };

  const imageGroups = getImageGroups();

  return (
    <>
      <section className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <Heading type="heading-3" className={styles.title}>
            {t("propertyDetail.additionalGallery")}
          </Heading>

          <div className={styles.gallery}>
            {imageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.column}>
                {group.images.map((image, imageIndex) => {
                  const globalIndex = group.indices[imageIndex];
                  const isLarge = globalIndex % 3 === 0;
                  
                  return (
                    <div
                      key={globalIndex}
                      className={cn(styles.imageWrapper, {
                        [styles.largeImage]: isLarge,
                        [styles.smallImage]: !isLarge,
                      })}
                      onClick={() => handleImageClick(image, globalIndex)}
                    >
                      <Image
                        src={image}
                        alt={`${title} - Image ${globalIndex + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className={styles.image}
                        unoptimized={image?.startsWith("http") || false}
                      />
                      <div className={styles.overlay}>
                        <div className={styles.zoomIcon}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <Modal visible={!!selectedImage} onClose={handleCloseModal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={handleCloseModal} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <button className={styles.navButton} onClick={handlePrev} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className={styles.modalImage}>
              <Image
                src={selectedImage}
                alt={`${title} - Image ${selectedIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                unoptimized={selectedImage?.startsWith("http") || false}
              />
            </div>
            <button className={cn(styles.navButton, styles.navButtonRight)} onClick={handleNext} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className={styles.imageCounter}>
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

