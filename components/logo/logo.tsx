import Link from "next/link";
import Image from "next/image";
import styles from "./logo.module.css";
import cn from "classnames";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn(styles.logo, className)}>
      <Image
        src="/images/logo.png"
        alt="Al Hulool Al Muthla Logo"
        width={150}
        height={50}
        className={styles.logo_image}
        priority
      />
    </Link>
  );
}
