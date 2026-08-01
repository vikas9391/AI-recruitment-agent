import { Layout } from "../components/layout/Layout";
import { Hero } from "../components/sections/Hero";
import { WorkflowTimeline } from "../components/sections/WorkflowTimeline";
import { FeatureGrid } from "../components/sections/FeatureGrid";
import { WhyCrewSync } from "../components/sections/WhyCrewSync";
import { ProductShowcase } from "../components/sections/ProductShowcase";
import { TrustedBy } from "../components/sections/TrustedBy";

export default function Landing() {
  return (
    <Layout>
      <Hero />
      <WorkflowTimeline />
      <FeatureGrid />
      <WhyCrewSync />
      <ProductShowcase />
      <TrustedBy />
    </Layout>
  );
}