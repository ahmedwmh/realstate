import React from "react";
import styles from "./benefits.module.css";
import cn from "classnames";
import { Heading } from "@/components/typography";
import Image from "next/image";
import { Checkmark } from "@/constants/icons";
import Link from "next/link";

const benefits = [
  {
    id: 1,
    title: "Why choose us?",
    description:
      "We are committed to providing exceptional service and unparallaled expertise in the real estate market. Our features are designed to ensure a smooth and rewarding experience for our clients, whether you are buying, selling, or investing.",
    image: "/images/benefit-1.webp",
    items: [
      {
        id: 1,
        title: "Expert agents",
      },
      {
        id: 2,
        title: "Comprehensive listings",
      },
      {
        id: 3,
        title: "Personalized service",
      },
    ],
  },
  {
    id: 2,
    title: "Benefits of choosing Al Hulool Al Muthla",
    description:
      "We offer a range of benefits that set us apart from other real estate agencies. Our team of experts will guide you through the process, ensuring you get the best deal possible.",
    image: "/images/benefit-2.webp",
    items: [
      {
        id: 1,
        title: "Tailored approach",
      },
      {
        id: 2,
        title: "Extensive network",
      },
      {
        id: 3,
        title: "Proven track record",
      },
    ],
  },
];

export default function Benefits() {
  return (
    <section className={cn("section")}>
      {benefits.map((benefit) => (
        <div key={benefit.id} className={cn("container", styles.container)}>
          <div className={styles.image}>
            <Image
              src={benefit.image}
              alt="Benefits"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={styles.content}>
            <Heading type="heading-3">{benefit.title}</Heading>
            <div className={cn("paragraph-large", styles.subtitle)}>
              {benefit.description}
            </div>

            <ul className={styles.list}>
              {benefit.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.icon}>{Checkmark}</div>
                  <div className={cn("paragraph-medium", styles.text)}>
                    {item.title}
                  </div>
                </li>
              ))}
            </ul>

            <Link href="/about" className={cn("button", styles.button)}>
              Learn more
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
}
