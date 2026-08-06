import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/seo/Seo";
import { useEffect, useState } from "react";

const Projects = () => {
  const [currentProjectImageIndex, setCurrentProjectImageIndex] = useState<Record<string, number>>({});

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!projects || projects.length === 0) return;
    const interval = window.setInterval(() => {
      setCurrentProjectImageIndex((prev) => {
        const nextState: Record<string, number> = {};
        for (const project of projects) {
          const imageUrls = project.image_urls?.length ? project.image_urls : project.image_url ? [project.image_url] : [];
          if (imageUrls.length > 1) {
            const currentIndex = prev[project.id] ?? 0;
            nextState[project.id] = (currentIndex + 1) % imageUrls.length;
          } else if (imageUrls.length === 1) {
            nextState[project.id] = 0;
          }
        }
        return nextState;
      });
    }, 4000);
    return () => window.clearInterval(interval);
  }, [projects]);

  return (
    <Layout>
      <Seo
        title="Projects - Ragul S"
        description="Browse software projects built by Ragul S — full-stack web applications, cybersecurity tools, open-source work, and more."
        path="/projects"
        keywords="Ragul S projects, Ragul portfolio, Ragul web projects, Ragul S github, cybersecurity projects"
      />
      <section className="py-24 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 0%, hsl(187 85% 53% / 0.04) 0%, transparent 50%)",
            }}
          />
          <div className="absolute inset-0 divider-grid opacity-30" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="section-badge mb-6">
              <FolderGit2 className="w-4 h-4" />
              Portfolio
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-5">
              My <span className="gradient-text-mesh">Projects</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A collection of projects I've built — from full-stack web apps to open-source tools and personal experiments.
            </p>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-48 bg-muted rounded-xl mb-4" />
                  <div className="h-6 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link to={`/projects/${project.slug}`} className="block h-full">
                    <div className="glass-card p-6 group glass-card-hover animated-border h-full relative overflow-hidden">
                      {/* Image */}
                      {((project.image_urls && project.image_urls.length > 0) || project.image_url) && (
                        <div className="mb-5 rounded-xl overflow-hidden relative">
                          <img
                            src={
                              (project.image_urls?.length
                                ? project.image_urls[currentProjectImageIndex[project.id] ?? 0]
                                : project.image_url) || ""
                            }
                            alt={project.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          {(project.image_urls?.length || 0) > 1 && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                              {project.image_urls!.map((_, dotIndex) => (
                                <span
                                  key={dotIndex}
                                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                                    (currentProjectImageIndex[project.id] ?? 0) === dotIndex
                                      ? "bg-white w-4"
                                      : "bg-white/40"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tech Stack */}
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tech_stack.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs bg-primary/8 border border-primary/15 text-primary/80">
                              {tech}
                            </Badge>
                          ))}
                          {project.tech_stack.length > 4 && (
                            <Badge variant="secondary" className="text-xs bg-muted/50 border border-border/30 text-muted-foreground">
                              +{project.tech_stack.length - 4}
                            </Badge>
                          )}
                        </div>
                      )}

                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                        {project.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                        {project.description || "A project built with modern technologies."}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-primary text-sm font-medium group/link">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform duration-300" />
                        </div>
                        <div className="flex items-center gap-2">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/25 transition-all"
                            >
                              <Github className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-8 h-8 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/25 transition-all"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/30 border border-border/30 flex items-center justify-center">
                <FolderGit2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground">Projects will appear here once added.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
