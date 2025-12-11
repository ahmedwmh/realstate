import React from "react";
import cn from "classnames";
import styles from "./modal.module.css";
import { createPortal } from "react-dom";

type ModalProps = {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  className?: string;
};

export default function Modal({
  children,
  visible,
  onClose,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!visible) return null;

  return createPortal(
    <div className={styles.modalWrapper} onClick={handleOverlayClick}>
      <div className={cn(styles.overlay, className)} />
      <div className={styles.modalBody} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
