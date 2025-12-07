import cn from "classnames";
import Image from "next/image";
import styles from "./property-listing.module.css";
import Link from "next/link";
import PropertyFeatures from "../property-features";

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

export default function PropertyListing({ item }: PropertyListingProps) {
  return (
    <div key={item.id} className={styles.listing}>
      <Link
        href={{
          pathname: "/property-detail",
          query: { item: JSON.stringify(item) },
        }}
        className={styles.img_holder}
      >
        <Image
          src={item.images && item.images[0] ? item.images[0] : "/images/intro.webp"}
          alt={item.title}
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          unoptimized={item.images?.[0]?.startsWith("http")}
        />
      </Link>
      <div className={styles.listing_wrapper}>
        <div className={cn("heading-6", styles.listing_title)}>
          {item.title}
        </div>
        <div className={cn("paragraph-medium", styles.listing_description)}>
          {item.description}
        </div>

        <PropertyFeatures
          features={item.features}
          className={styles.features}
        />
      </div>
    </div>
  );
}
