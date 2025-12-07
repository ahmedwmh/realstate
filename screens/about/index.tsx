import Layout from "@/components/Layout";
import React from "react";
import Hero from "./hero";
import AboutSection from "./about-section";
import Services from "./services";
import Vision from "./vision";
import Values from "./values";
import Offices from "../universal/offices";
import Facts from "../universal/facts";
import Gallery from "./gallery";
import Newsletter from "../universal/newsletter";

export default function AboutPage() {
  return (
    <Layout>
      <Hero />
      <AboutSection />
      <Services />
      <Vision />
      <Values />
      <Offices />
      <Facts />
      <Gallery />
      <Newsletter />
    </Layout>
  );
}
