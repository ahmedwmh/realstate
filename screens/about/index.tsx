import Layout from "@/components/Layout";
import React from "react";
import Hero from "./hero";
import AboutSection from "./about-section";
import Services from "./services";
import Vision from "./vision";
import Values from "./values";

export default function AboutPage() {
  return (
    <Layout>
      <Hero />
      <AboutSection />
      <Services />
      <Vision />
      <Values />
    </Layout>
  );
}
