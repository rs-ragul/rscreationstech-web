import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Code2, Zap, Target, Heart, GraduationCap, MapPin, Calendar, Shield } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const techStack = [
  "React", "TypeScript", "Tailwind CSS", "Vite", "Supabase", "PostgreSQL",
  "Node.js", "Python", "Git & GitHub", "Linux", "Kali Linux", "Burp Suite",
];

const About = () => {
  return (
    <Layout>
      <Seo
        title="About Ragul S - Developer & Cybersecurity Enthusiast"
        description="Ragul S is a Full Stack Developer and Cybersecurity student at PSNA College of Engineering and Technology. Passionate about building secure web applications and ethical hacking."
        path="/about"
        type="profile"
        keywords="Ragul S, Ragul, about Ragul, Ragul developer, Ragul cybersecurity, Ragul PSNA College"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          mainEntity: {
            "@type": "Person",
            name: "Ragul S",
            alternateName: ["Ragul", "Ragul S"],
            jobTitle: "Full Stack Developer & Cybersecurity Enthusiast",
            alumniOf: {
              "@type": "EducationalOrganization",
              name: "Srinivasa Matriculation Hr Sec School, Kollidam",
            },
            studentOf: {
              "@type": "CollegeOrUniversity",
              name: "PSNA College of Engineering and Technology",
            },
            knowsAbout: ["Cybersecurity", "Ethical Hacking", "Full Stack Development", "React", "TypeScript", "Python"],
            address: {
              "@type": "PostalAddress",
              addressRegion: "Tamil Nadu",
              addressCountry: "IN",
            },
            sameAs: [
              "https://github.com/rs-ragul",
              "https://www.linkedin.com/in/ragul-rs/",
              "https://www.instagram.com/rscreations.tech/",
            ],
          },
        }}
      />
      <section className="py-24 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, hsl(187 85% 53% / 0.04) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Premium Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="section-badge mb-6">
                <MapPin className="w-4 h-4" />
                Tamil Nadu, India
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-5">
                About <span className="gradient-text-mesh">Me</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A passionate developer and cybersecurity enthusiast building the future of secure software.
              </p>
            </motion.div>

            {/* Quick Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              {[
                { icon: GraduationCap, label: "Studying", value: "CSE (Cyber Security)" },
                { icon: Calendar, label: "College", value: "PSNA College of Eng. & Tech." },
                { icon: Zap, label: "Focus", value: "Web Dev & Cybersecurity" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="glass-card p-5 glass-card-hover animated-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Story Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-7 mb-6 animated-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">My Story</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I'm Ragul S, currently studying Computer Science and Engineering with Cyber Security Specialization at PSNA College of Engineering and Technology.
                </p>
                <p>
                  I didn't start with a clear plan to become a developer or a cybersecurity professional. Like many people, my interest in technology grew gradually. At first, it was just curiosity — using computers, exploring software, and wanting to understand how things work instead of only using them.
                </p>
                <p>
                  Over time, that curiosity turned into interest. I started learning more about programming, systems, and how applications are built. While exploring these areas, I became especially interested in how systems can fail, how mistakes happen, and how they can be prevented. That's what slowly pulled me toward cybersecurity.
                </p>
                <p>
                  I'm still learning. I don't claim to know everything, and I don't rush to label myself as an expert. I prefer taking time to understand things properly, even if that means learning slowly and making mistakes along the way.
                </p>
                <p>
                  This website reflects that journey — learning, building, experimenting, and improving step by step.
                </p>
              </div>
            </motion.div>

            {/* What I Build */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-7 mb-6 animated-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">What I Build</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Right now, I spend my time learning and building things related to technology and security.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">That includes:</p>
              <ul className="space-y-3">
                {[
                  "Creating websites and full-stack web applications with modern frameworks",
                  "Exploring how authentication, data storage, and user flows are designed",
                  "Learning security concepts by looking at how applications can be misused or broken",
                  "Experimenting with Linux, ethical hacking tools, and penetration testing",
                  "Building admin panels, dashboards, and consumer-facing apps",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                I build projects mainly to learn, not to impress. Every project helps me understand something new.
              </p>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-7 mb-6 animated-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Tech Stack</h2>
              </div>
              <p className="text-muted-foreground mb-5">These are tools I currently use or actively learning:</p>
              <div className="flex flex-wrap gap-2.5">
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 rounded-lg bg-muted/40 border border-border/30 text-sm font-medium transition-all duration-300 hover:border-primary/25 hover:text-primary cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-7 animated-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Vision</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  I want to grow into a well-rounded technology professional with a strong understanding of both development and cybersecurity. My goal is to gain real experience, learn how systems work in the real world, and eventually build things that are reliable, secure, and genuinely useful.
                </p>
                <p>
                  I don't believe in shortcuts or hype. I believe progress comes from consistency, curiosity, and patience — and that's the approach I'm following.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
