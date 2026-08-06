import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  return (
    <Layout>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, hsl(225 45% 8%) 0%, hsl(225 50% 5%) 100%)",
            }}
          />
          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
          {/* Glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/6 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative z-10 text-center px-4">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-[120px] sm:text-[180px] md:text-[220px] font-bold leading-none tracking-tighter">
              <span className="gradient-text-mesh">404</span>
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Page Not Found</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="btn-premium bg-gradient-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-primary transition-all duration-500 shadow-lg shadow-primary/20"
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="group">
              <Link to="/contact">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Contact Me
              </Link>
            </Button>
          </motion.div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-20 w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 hidden md:block"
          />
          <motion.div
            animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-20 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 hidden md:block"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/3 right-1/4 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hidden md:block"
          />
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
