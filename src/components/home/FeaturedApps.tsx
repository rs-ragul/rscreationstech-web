import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function FeaturedApps() {
  const { data: apps, isLoading } = useQuery({
    queryKey: ["featured-apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("is_featured", true)
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-28" id="apps">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Apps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-muted mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-4" />
                <div className="h-10 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!apps || apps.length === 0) {
    return (
      <section className="py-28" id="apps">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Apps</span>
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Featured apps will appear here once added.
            </p>
            <Button asChild variant="outline" size="lg" className="btn-premium">
              <Link to="/apps">
                Browse All Apps
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-28 relative overflow-hidden" id="apps">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, hsl(187 85% 53% / 0.03) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 divider-grid opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="section-badge mb-6">
            <Sparkles className="w-4 h-4" />
            Featured Work
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Featured <span className="gradient-text">Apps</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Some of my most impactful applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {apps.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/apps/${app.slug}`}
                className="block glass-card p-6 h-full group glass-card-hover animated-border relative overflow-hidden"
              >
                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 overflow-hidden"
                  >
                    {app.logo_url ? (
                      <img
                        src={app.logo_url}
                        alt={app.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <Download className="w-8 h-8 text-primary" />
                    )}
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2.5 group-hover:text-primary transition-colors duration-300">
                    {app.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-5 leading-relaxed">
                    {app.short_description || "A powerful application"}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>View Details</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="group btn-premium">
            <Link to="/apps">
              View All Apps
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
