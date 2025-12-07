import React from "react";
import styles from "./newsletter.module.css";
import cn from "classnames";
import { Bag, Notification } from "@/constants/icons";
import { TextField } from "@/components/elements";
import Link from "next/link";

export default function Newsletter() {
  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={cn("subheading-small", styles.title)}>Newsletter</div>
        <div className={styles.columns}>
          <div className={styles.column}>
            <div className={cn("gradient-bubble")}>{Bag}</div>

            <div>
              <div className={cn("heading-6", styles.text)}>
                {"We're hiring!"}
              </div>
              <div className={cn("paragraph-medium", styles.subtitle)}>
                Al Hulool Al Muthla is always looking for talented and passionate
                individuals to join our team. If you are driven,
                customer-focused, and eager to make a difference, we want to
                hear from you!
              </div>
            </div>
            <div className={styles.wrapper}>
              <Link href="/about" className={cn("button", styles.button)}>
                Our Story
              </Link>
              <button className={cn("button-stroke", styles.button)}>
                Join Us
              </button>
            </div>
          </div>

          <div className={styles.column}>
            <div className={cn("gradient-bubble")}>{Notification}</div>
            <div>
              <div className={cn("heading-6", styles.text)}>
                Join our newsletter
              </div>
              <div className={cn("paragraph-medium", styles.subtitle)}>
                Sign up for our newsletter to receive the real estate news,
                market updates, and exclusive property listings directly to your
                inbox. Stay informed and never miss an oppurtunity!
              </div>
            </div>

            <div className={styles.wrapper}>
              <TextField
                type="email"
                placeholder="Enter your email"
                className={styles.input}
              />
              <button className={cn("button", styles.button)}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
