import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, FolderGit2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProjectDetails = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-8" />
              <div className="h-48 bg-muted rounded mb-6" />
              <div className="h-8 bg-muted rounded w-1/2 mb-4" />
              <div className="h-5 bg-muted rounded w-3/4" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <section className="py-20 min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/projects">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button variant="ghost" asChild>
                <Link to="/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 md:p-8"
            >
              {project.image_url ? (
                <div className="mb-6 rounded-xl overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              ) : (
                <div className="mb-6 w-full h-64 md:h-80 rounded-xl bg-muted flex items-center justify-center">
                  <FolderGit2 className="w-12 h-12 text-muted-foreground" />
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
                  <p className="text-muted-foreground">
                    {project.description || "A project built with modern technologies."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {project.github_url && (
                    <Button variant="outline" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  {project.live_url && (
                    <Button variant="outline" asChild>
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Tech Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetails;
