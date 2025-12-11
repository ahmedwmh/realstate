import Layout from "@/components/Layout";
import Hero from "./hero";
import Overview from "./overview";
import Gallery from "./gallery";

export default function PropertyDetailPage({ project }: any) {
  const title = project.titleEn || project.titleAr || "Property";
  const images = project.images || [];

  return (
    <Layout>
      <Hero project={project} />
      <Overview project={project} />
      {images.length > 0 && <Gallery images={images} title={title} />}
    </Layout>
  );
}
