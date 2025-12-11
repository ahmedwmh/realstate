import React from "react";
import styles from "./property-features.module.css";
import cn from "classnames";

type PropertyFeaturesProps = {
  className?: string;
  features: {
    id: number;
    icon: string;
    name: string;
    value: string | number;
  }[];
};

export default function PropertyFeatures({
  className,
  features,
}: PropertyFeaturesProps) {
  return (
    <div className={cn(styles.features, className)}>
      {features.map((feature) => (
        <div key={feature.id} className={styles.feature}>
          <div className={cn("paragraph-small", styles.feature_name)}>
            {feature.value}
          </div>
        </div>
      ))}
    </div>
  );
}
