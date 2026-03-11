import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedApps } from "@/components/home/FeaturedApps";
import { SkillsSection } from "@/components/home/SkillsSection";
import { EducationTimeline } from "@/components/home/EducationTimeline";
import { CurrentlyLearning } from "@/components/home/CurrentlyLearning";
import { JourneySection } from "@/components/home/JourneySection";
import { SectionDivider } from "@/components/home/SectionDivider";
import { Seo } from "@/components/seo/Seo";

const getSiteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  if (configured && configured.trim().length > 0) {
    return configured.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://rscreationstech.com";
};

const Index = () => {
  const siteUrl = getSiteUrl();

  return (
    <Layout>
      <Seo
        title="RS Creations Tech"
        description="Portfolio of Ragul S, student at PSNA College of Engineering and Technology, building apps, projects, and cybersecurity-focused solutions."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RS Creations Tech",
            url: siteUrl,
            publisher: {
              "@type": "Organization",
              name: "RS Creations Tech",
              url: siteUrl,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ragul S",
            url: siteUrl,
            jobTitle: "Student Developer",
            affiliation: {
              "@type": "CollegeOrUniversity",
              name: "PSNA College of Engineering and Technology",
            },
            worksFor: {
              "@type": "Organization",
              name: "RS Creations Tech",
            },
            knowsAbout: ["Cybersecurity", "Software Development", "Web Development"],
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RS Creations Tech",
            url: siteUrl,
            founder: {
              "@type": "Person",
              name: "Ragul S",
            },
          },
        ]}
      />
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
