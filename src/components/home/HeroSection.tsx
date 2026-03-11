import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Download, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative hero-gradient min-h-[90vh] flex items-center overflow-hidden">
      {/* Background decorations - enhanced */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated glow orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl"
        />
      </div>

      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] animate-grid-pulse"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Gradient mesh overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, hsl(187 85% 53% / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, hsl(174 72% 56% / 0.1) 0%, transparent 50%)',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with glow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 glow-on-hover"
          >
            <Sparkles className="w-4 h-4 text-primary animate-bounce-subtle" />
            <span className="text-sm font-medium text-primary">Developer & Creator</span>
          </motion.div>

          {/* Heading with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Building the{" "}
            <span className="gradient-text">Future</span>{" "}
            of Software
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance"
          >
            Creating apps, tools, and platforms focused on real-world impact.
          </motion.p>

          {/* CTA Buttons with gradient hover */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              asChild 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-primary transition-all duration-300"
            >
              <Link to="/apps">
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce-subtle" />
                View Apps
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="group border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <Link to="/projects">
                <Code2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                View Projects
              </Link>
            </Button>
            <Button 
              asChild 
              variant="ghost" 
              size="lg"
              className="hover:bg-primary/5 transition-colors duration-200"
            >
              <Link to="/contact">Contact Me</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 bg-primary rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
