import Layout from "@/components/Layout";
import Hero from "./hero";
import NewsList from "./news-list";

export default function NewsPage() {
  return (
    <Layout>
      <Hero />
      <NewsList />
    </Layout>
  );
}

