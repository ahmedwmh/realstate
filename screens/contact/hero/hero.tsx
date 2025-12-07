"use client";

import React from "react";
import styles from "./hero.module.css";
import cn from "classnames";
import { TextArea, TextField } from "@/components/elements";
import MapView from "@/components/mapview";

export default function Hero() {
  return (
    <section className={cn("section", styles.section)}>
      <div className={cn("container")}>
        <div className={styles.information}>
          <div className={styles.column}>
            <div className={cn("heading-6", styles.title)}>Get In Touch</div>
            <div className={cn("paragraph-medium", styles.subtitle)}>
              {
                "We'd love to hear from you! Whether you have a question about our listings, services, our just want to talk about your dream home, our team is here to help."
              }
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.contact}>
            <div>
              <div className={cn("subheading-medium", styles.contact_title)}>
                OFFICE
              </div>
              <div className={cn("paragraph-medium", styles.contact_text)}>
                123 Serenity Street, Suburbia, TX 75001
              </div>
            </div>

            <div>
              <div className={cn("subheading-medium", styles.contact_title)}>
                CONTACT
              </div>
              <div className={cn("paragraph-medium", styles.contact_text)}>
                (123) 456-7890
              </div>
              <div className={cn("paragraph-medium", styles.contact_text)}>
                info@alhulool-almuthla.com
              </div>
            </div>
          </div>
        </div>

        <div className={styles.map}>
          <MapView />
        </div>

        <form className={styles.form}>
          <div className={styles.rowFields}>
            <TextField
              name="name"
              type="name"
              placeholder="First Name"
              required
            />
            <TextField
              name="name"
              type="name"
              placeholder="Last Name"
              required
            />
          </div>
          <TextField
            name="phone"
            type="tel"
            placeholder="Phone Number"
            required
          />

          <TextArea name="message" placeholder="Message" required />
          <div className={styles.rowFields}>
            <button className={cn("button", styles.button)}>Send</button>
            <div className={cn("paragraph-small", styles.agreeText)}>
              By submitting, you agree to our <span>Privacy Policy</span> and
              consent to be contacted by Al Hulool Al Muthla.
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
