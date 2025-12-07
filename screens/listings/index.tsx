"use client";

import Layout from "@/components/Layout";
import React from "react";
import ListingsHero from "./hero";
import ProjectsList from "./projects-list";

export default function ListingsPage() {
  return (
    <Layout>
      <ListingsHero />
      <ProjectsList />
    </Layout>
  );
}
