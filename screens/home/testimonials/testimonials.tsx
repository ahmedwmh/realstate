"use client";

import React from "react";
import styles from "./testimonials.module.css";
import cn from "classnames";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "@/constants/icons";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    image: "/images/testimonials/john-lisa.webp",
    name: "John and Lisa Anderson",
    span: "Happy Homeowners",
    text: "Al Hulool Al Muthla helped us find our dream home. We were able to find a home that was perfect for our family. We are so grateful for their help and would recommend them to anyone looking for a home.",
  },
  {
    id: 2,
    image: "/images/testimonials/sarah-michael.webp",
    name: "Tom and Jane Smith",
    span: "Happy Homeowners",
    text: "We were so happy with the service we received from Al Hulool Al Muthla. They were able to help us find a home that was perfect for our family. We would recommend them to anyone looking for a home.",
  },
  {
    id: 3,
    image: "/images/testimonials/emily-david.webp",
    name: "Emily and David Brown",
    span: "Happy Homeowners",
    text: "Working with Al Hulool Al Muthla was a great experience. They were able to help us find a home that was perfect for our family. We would recommend them to anyone looking for a home.",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = React.useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  return (
    <section className={cn("section")}>
      <div className={cn("container")}>
        <div className={cn("subheading-small", styles.title)}>Testimonials</div>

        <div className={styles.testimonial}>
          <div className={styles.testimonial_image}>
            <Image
              src={testimonials[current].image}
              alt={testimonials[current].name}
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className={styles.testimonial_info}>
            <div>
              <div className={cn("heading-6", styles.text)}>
                {testimonials[current].text}
              </div>

              <div className={cn("paragraph-medium", styles.testimonial_name)}>
                {testimonials[current].name},&nbsp;
                <span className={styles.span}>
                  {testimonials[current].span}
                </span>
              </div>
            </div>

            <div className={styles.btns}>
              <button
                className={cn("button-stroke-small", styles.btn)}
                onClick={prevSlide}
              >
                {ChevronLeft}
              </button>

              <button
                className={cn("button-stroke-small", styles.btn)}
                onClick={nextSlide}
              >
                {ChevronRight}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
