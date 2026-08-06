import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, FileText, Clock, User } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <Seo
        title="Blog - Ragul S"
        description="Read articles and technical notes by Ragul S on software development, cybersecurity, and engineering insights."
        path="/blog"
        keywords="Ragul S blog, Ragul articles, Ragul cybersecurity blog, Ragul developer blog"
      />
      <section className="py-24 min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, hsl(187 85% 53% / 0.03) 0%, transparent 50%)",
            }}
          />
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
              <FileText className="w-4 h-4" />
              Articles
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-5">
              <span className="gradient-text-mesh">Blog</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Thoughts, tutorials, and insights on software development and cybersecurity.
            </p>
          </motion.div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-48 bg-muted rounded-xl mb-5" />
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-full mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {posts.map((post, index) => {
                const coverImage = post.cover_image_urls?.[0] || post.cover_image_url;

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="block glass-card overflow-hidden glass-card-hover animated-border group h-full"
                    >
                      {coverImage && (
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.published_at)}
                          </div>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {Math.ceil((post.content?.length || 0) / 1000)} min read
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-2.5 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center text-primary text-sm font-medium">
                          Read more
                          <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/30 border border-border/30 flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
              <p className="text-muted-foreground">Blog posts will appear here once published.</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
