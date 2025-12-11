"use client";

import React from "react";
import cn from "classnames";
import styles from "./header.module.css";
import Logo from "../logo";
import Burger from "../burger";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/language-context";

const nav_links = [
  { titleKey: "header.home", href: "/" },
  { titleKey: "header.aboutUs", href: "/about" },
  { titleKey: "header.listings", href: "/listings" },
  { titleKey: "header.news", href: "/news" },
];

const blackHeaderPages = [
  "/",
  "/contact",
  "/property-detail",
  "/news",
];

export default function Header() {
  const [visibleNav, setVisibleNav] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);
  const [sticky, setSticky] = React.useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t, dir } = useLanguage();

  React.useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navVariants = {
    hidden: { clipPath: "inset(0% 0% 100% 0%)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 25,
        mass: 2,
        delay: 0.2,
      },
    },
  };

  const handleScrollSection = (
    e:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = mobile ? 0 : 100;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: y, behavior: "smooth" });

      if (mobile) {
        setVisibleNav(false);
      }
    }
  };

  const isBlackHeader = blackHeaderPages.includes(pathname) || pathname.startsWith("/news/");

  return (
    <header
      className={cn(styles.header, {
        [styles.sticky]: sticky,
        [styles.border_header]: isBlackHeader,
        [styles.white_header]: pathname === "/" && !sticky,
      })}
    >
      <div className={cn("container", styles.container)}>
        <Logo
          className={cn(styles.logo, {
            [styles.black_logo]:
              (isBlackHeader && !(mobile && visibleNav)) || sticky,
            [styles.sticky_logo]: sticky,
          })}
        />

        <motion.nav
          className={cn(styles.nav, {
            [styles.visible]: visibleNav,
          })}
          initial={mobile ? "hidden" : false}
          animate={mobile && visibleNav ? "visible" : "hidden"}
          variants={mobile ? navVariants : {}}
        >
          <div className={styles.nav_links}>
            {nav_links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={cn("label-small", styles.nav_link, {
                  [styles.active]: pathname === link.href,
                  [styles.black_link]: isBlackHeader && !(mobile && visibleNav),
                  [styles.sticky_link]: sticky,
                })}
              >
                {t(link.titleKey)}
              </Link>
            ))}
          </div>
        </motion.nav>

        <div className={styles.button_wrapper}>
          <div className={styles.language_switcher}>
            <button
              className={cn(styles.lang_button, {
                [styles.lang_active]: language === "en",
                [styles.black_lang]: isBlackHeader && !(mobile && visibleNav),
                [styles.sticky_lang]: sticky,
              })}
              onClick={() => setLanguage("en")}
            >
              EN
            </button>
            <button
              className={cn(styles.lang_button, {
                [styles.lang_active]: language === "ar",
                [styles.black_lang]: isBlackHeader && !(mobile && visibleNav),
                [styles.sticky_lang]: sticky,
              })}
              onClick={() => setLanguage("ar")}
            >
              AR
            </button>
          </div>

          <Link
            href="/contact"
            className={cn("button-stroke-small", styles.button, {
              [styles.black_button]: isBlackHeader && !(mobile && visibleNav),
              [styles.orange_button]: pathname === "/" && !sticky && !(mobile && visibleNav),
              [styles.sticky_button]: sticky,
            })}
          >
            {t("header.getInTouch")}
          </Link>

          <Burger
            className={styles.burger}
            burgerClassName={cn(styles.burger, {
              [styles.black_burger]: isBlackHeader && !(mobile && visibleNav),
              [styles.sticky_burger]: sticky,
            })}
            visibleNav={visibleNav}
            setVisibleNav={setVisibleNav}
          />
        </div>
      </div>
    </header>
  );
}
