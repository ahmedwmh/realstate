import Layout from "@/components/Layout";
import Hero from "./hero";
import Overview from "./overview";

export default function PropertyDetailPage({ project }: any) {
  return (
    <Layout>
      <Hero project={project} />
      <Overview project={project} />
    </Layout>
  );
}
