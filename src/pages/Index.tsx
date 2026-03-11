import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedApps } from "@/components/home/FeaturedApps";
import { SkillsSection } from "@/components/home/SkillsSection";
import { EducationTimeline } from "@/components/home/EducationTimeline";
import { CurrentlyLearning } from "@/components/home/CurrentlyLearning";
import { JourneySection } from "@/components/home/JourneySection";
import { SectionDivider } from "@/components/home/SectionDivider";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <SectionDivider variant="gradient" />
      <FeaturedApps />
      <SectionDivider variant="grid" />
      <SkillsSection />
      <SectionDivider variant="glow" />
      <JourneySection />
      <SectionDivider variant="gradient" />
      <EducationTimeline />
      <SectionDivider variant="grid" />
      <CurrentlyLearning />
    </Layout>
  );
};

export default Index;
