import Layout from "@/components/Layout";
import LatestListings from "./latest-listings";
import Benefits from "./benefits";
import Showcase from "./showcase";
import Services from "./services";
import Hero from "./hero";
import Facts from "../universal/facts";

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
