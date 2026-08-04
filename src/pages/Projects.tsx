import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";
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
          const imageUrls = project.image_urls?.length
            ? project.image_urls
            : project.image_url
              ? [project.image_url]
              : [];

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
        title="Projects"
        description="Browse software projects built by Ragul S at RS Creations Tech, including web applications, experiments, and open-source work."
        path="/projects"
      />
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A collection of projects I've built, from open-source tools to personal experiments.
            </p>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="glass-card p-6 group glass-card-hover"
                >
                  <Link to={`/projects/${project.slug}`} className="block">
                    {((project.image_urls && project.image_urls.length > 0) || project.image_url) && (
                      <div className="mb-4 rounded-lg overflow-hidden relative">
                        <img
                          src={
                            (project.image_urls?.length
                              ? project.image_urls[currentProjectImageIndex[project.id] ?? 0]
                              : project.image_url) || ""
                          }
                          alt={project.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {(project.image_urls?.length || 0) > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {project.image_urls!.map((_, dotIndex) => (
                              <span
                                key={dotIndex}
                                className={`h-2 w-2 rounded-full ${
                                  (currentProjectImageIndex[project.id] ?? 0) === dotIndex
                                    ? "bg-white"
                                    : "bg-white/50"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {project.description || "A project built with modern technologies."}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium group/link">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                  
                  {/* Tech Stack */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs bg-primary/10 border border-primary/30 text-primary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    {project.github_url && (
                      <Button variant="outline" size="sm" asChild className="group/btn">
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-1 group-hover/btn:rotate-12 transition-transform" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {project.live_url && (
                      <Button variant="outline" size="sm" asChild className="group/btn">
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1 group-hover/btn:rotate-12 transition-transform" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-muted flex items-center justify-center">
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
