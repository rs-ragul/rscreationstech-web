import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const imageUrls =
    post?.cover_image_urls && post.cover_image_urls.length > 0
      ? post.cover_image_urls
      : post?.cover_image_url
        ? [post.cover_image_url]
        : [];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [post?.id]);

  useEffect(() => {
    if (imageUrls.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [imageUrls.length]);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-20 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto animate-pulse">
              <div className="h-8 bg-muted rounded w-32 mb-8" />
              <div className="h-12 bg-muted rounded w-3/4 mb-4" />
              <div className="h-6 bg-muted rounded w-1/4 mb-8" />
              <div className="space-y-4">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="py-20 min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {post && (
        <Seo
          title={post.title}
          description={post.excerpt || "Article by Ragul S on RS Creations Tech."}
          path={`/blog/${post.slug}`}
          type="article"
          image={imageUrls[0] || undefined}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt || "Technical article by Ragul S",
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at,
            author: {
              "@type": "Person",
              name: "Ragul S",
            },
            publisher: {
              "@type": "Organization",
              name: "RS Creations Tech",
            },
            mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
            image: imageUrls[0] || `${getSiteUrl()}/rscreationslogo.ico`,
          }}
        />
      )}
      <article className="py-20 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Button variant="ghost" asChild>
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </motion.div>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {imageUrls.length > 0 && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8 relative">
                  <img
                    src={imageUrls[currentImageIndex]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {imageUrls.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {imageUrls.map((_, index) => (
                        <span
                          key={index}
                          className={`h-2 w-2 rounded-full ${
                            currentImageIndex === index ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {post.title}
              </h1>
              {post.published_at && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
                </div>
              )}
            </motion.header>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-invert prose-lg max-w-none"
            >
              <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </motion.div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
