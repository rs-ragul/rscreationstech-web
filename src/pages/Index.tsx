import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatIDoSection } from "@/components/home/WhatIDoSection";
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
        title="Ragul S - Full Stack Developer & Cybersecurity Enthusiast"
        description="Portfolio of Ragul S — Full Stack Developer, Cybersecurity student at PSNA College of Engineering and Technology. Building secure web applications, exploring ethical hacking, and creating innovative software solutions."
        path="/"
        type="profile"
        keywords="Ragul S, Ragul, Ragul ethical hacker, Ragul cybersecurity, Ragul developer, Ragul S portfolio, full stack developer, ethical hacker, PSNA College, cybersecurity student, React developer, penetration testing, web developer"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            dateCreated: "2025-01-01T00:00:00Z",
            mainEntity: {
              "@type": "Person",
              name: "Ragul S",
              alternateName: ["Ragul", "Ragul S"],
              url: siteUrl,
              jobTitle: "Full Stack Developer & Cybersecurity Enthusiast",
              description:
                "Full Stack Developer and Cybersecurity student at PSNA College of Engineering and Technology. Passionate about building secure web applications, ethical hacking, and creating innovative software solutions.",
              alumniOf: [
                {
                  "@type": "EducationalOrganization",
                  name: "Srinivasa Matriculation Hr Sec School, Kollidam",
                },
                {
                  "@type": "CollegeOrUniversity",
                  name: "PSNA College of Engineering and Technology",
                },
              ],
              knowsAbout: [
                "Cybersecurity",
                "Ethical Hacking",
                "Full Stack Development",
                "React",
                "TypeScript",
                "Node.js",
                "Python",
                "Penetration Testing",
                "Network Security",
                "Web Development",
              ],
              sameAs: [
                "https://github.com/rs-ragul",
                "https://www.linkedin.com/in/ragul-rs/",
                "https://www.instagram.com/rscreations.tech/",
              ],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ragul S - Portfolio",
            alternateName: "RS Creations Tech",
            url: siteUrl,
            publisher: {
              "@type": "Person",
              name: "Ragul S",
            },
          },
        ]}
      />
      <HeroSection />
      <WhatIDoSection />
      <SectionDivider variant="glow" />
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
