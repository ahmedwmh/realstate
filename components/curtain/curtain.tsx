"use client";

import React from "react";
import { motion } from "framer-motion";
import styles from "./curtain.module.css";

interface CurtainProps {
  onComplete?: () => void;
}

export default function Curtain({ onComplete }: CurtainProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const variants = {
    hidden: { clipPath: "inset(0% 0% 0% 0%)", scaleY: 1 },
    visible: {
      clipPath: "inset(0% 0% 100% 0%)",
      scaleY: 0.5,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 25,
        mass: 2,
        delay: 0.5,
        onComplete: () => {
          setIsVisible(false);
          onComplete?.();
        },
      },
    },
  };

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      className={styles.curtain}
      initial="hidden"
      animate="visible"
      variants={variants}
      style={{ originY: 0 }}
    >
      <motion.div className={styles.title}>Al Hulool Al Muthla™</motion.div>
    </motion.div>
  );
}
