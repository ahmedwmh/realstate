import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import Hero from "./hero";

// Lazy load components below the fold for better initial page load
const LatestListings = dynamic(() => import("./latest-listings"), {
  loading: () => null,
});
const Benefits = dynamic(() => import("./benefits"), {
  loading: () => null,
});
const Showcase = dynamic(() => import("./showcase"), {
  loading: () => null,
});
const Facts = dynamic(() => import("../universal/facts"), {
  loading: () => null,
});
const Services = dynamic(() => import("./services"), {
  loading: () => null,
});

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      <LatestListings />
      <Benefits />
      <Showcase />
      <Facts />
      <Services />
    </Layout>
  );
}
