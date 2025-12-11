import React from "react";
import cn from "classnames";
import Image from "next/image";
import styles from "./property-listing.module.css";
import Link from "next/link";

type PropertyListingProps = {
  item: {
    id: number;
    images: string[];
    title: string;
    price: string;
    description: string;
    features: {
      id: number;
      icon: string;
      name: string;
      value: string | number;
    }[];
  };
};

function PropertyListing({ item }: PropertyListingProps) {
  const imageSrc = item.images?.[0] || "/images/intro.webp";
  const isExternalImage = imageSrc.startsWith("http");

  return (
    <div className={styles.listing}>
      <Link
        href={{
          pathname: "/property-detail",
          query: { id: item.id },
        }}
        className={styles.img_holder}
      >
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={isExternalImage}
          loading="lazy"
        />
      </Link>
      <div className={styles.listing_wrapper}>
        <div className={cn("heading-6", styles.listing_title)}>
          {item.title}
        </div>
        <div className={cn("paragraph-medium", styles.listing_description)}>
          {item.description}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PropertyListing);
