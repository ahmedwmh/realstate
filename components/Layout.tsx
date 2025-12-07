"use client";

import React from "react";
import Curtain from "./curtain";
import Footer from "./footer";
import Header from "./header";
import { useLanguage } from "@/context/language-context";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { dir } = useLanguage();
  const [showCurtain, setShowCurtain] = React.useState<boolean>(false);

  React.useEffect(() => {
    const curtainShown = localStorage.getItem("curtain-shown");

    if (!curtainShown) {
      setShowCurtain(true);
      localStorage.setItem("curtain-shown", "true");
    }
  }, []);

  return (
    <div dir={dir}>
      {showCurtain && <Curtain />}
      <Header />
      {children}
      <Footer />
    </div>
  );
}
