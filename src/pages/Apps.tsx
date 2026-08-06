import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/seo/Seo";

const Apps = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: apps, isLoading } = useQuery({
    queryKey: ["apps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredApps = apps?.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.short_description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <Seo
        title="Apps - Ragul S"
        description="Explore apps built by Ragul S — practical utility apps, performance-focused tools, and clean user experiences."
        path="/apps"
        keywords="Ragul S apps, RS Creations Tech apps, Ragul android apps, Ragul developer apps"
      />
      <section className="py-24 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 70% 0%, hsl(187 85% 53% / 0.04) 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="section-badge mb-6">
              <Sparkles className="w-4 h-4" />
              Applications
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-5">
              My <span className="gradient-text-mesh">Apps</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-8">
              Applications I've built with attention to detail, performance, and user experience.
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 bg-card/50 border-border/30 focus:border-primary/30 h-12 rounded-xl transition-all"
              />
            </div>
          </motion.div>

          {/* Apps Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="w-16 h-16 rounded-xl bg-muted mb-4" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filteredApps && filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {filteredApps.map((app, index) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <div className="glass-card p-6 h-full group glass-card-hover animated-border relative overflow-hidden">
                    <Link to={`/apps/${app.slug}`} className="block h-full">
                      <div className="flex items-start gap-4 mb-5">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 3 }}
                          className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 overflow-hidden"
                        >
                          {app.logo_url ? (
                            <img src={app.logo_url} alt={app.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <Download className="w-8 h-8 text-primary" />
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300 truncate">
                            {app.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            {app.version && (
                              <span className="text-xs text-muted-foreground bg-muted/50 border border-border/30 px-2 py-0.5 rounded-md">
                                v{app.version}
                              </span>
                            )}
                            {app.is_upcoming && (
                              <span className="text-xs text-primary bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-md">
                                Coming Soon
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed mb-4">
                        {app.short_description || "A powerful application built with modern technologies."}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/30 border border-border/30 flex items-center justify-center">
                <Download className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Apps Found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Apps will appear here once added."}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Apps;
