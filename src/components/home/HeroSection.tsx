import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Github, Linkedin, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

/* ─── Floating Particles ─── */
function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.25 + 0.05,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.sin(p.id) * 20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typewriter ─── */
function TypewriterText() {
  const roles = [
    "Full Stack Developer",
    "Cybersecurity Enthusiast",
    "Ethical Hacker",
    "UI/UX Designer",
    "Problem Solver",
  ];
  const [currentRole, setCurrentRole] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRole];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < role.length) {
            setCurrentText(role.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(currentText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentRole((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRole]);

  return (
    <span className="gradient-text-mesh">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-7 md:h-9 bg-primary ml-1 align-middle rounded-full"
      />
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* ─── Background Layers ─── */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, hsl(187 85% 53% / 0.07) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(260 60% 60% / 0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(225 50% 5%) 0%, hsl(225 50% 3%) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[15%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-20 right-[15%] w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[120px]"
        />
        <ParticleField />
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto px-4 relative z-10 pt-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-3 text-center lg:text-left">
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-sm font-medium text-primary/90">Available for opportunities</span>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <p className="text-muted-foreground text-lg mb-3 tracking-wide">Hello, I'm</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-5">
                  <span className="text-foreground">Ragul</span>{" "}
                  <span className="gradient-text-mesh">S</span>
                </h1>
              </motion.div>

              {/* Typewriter Role */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl font-semibold mb-6 h-10 flex items-center justify-center lg:justify-start"
              >
                <TypewriterText />
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                CSE (Cyber Security) student at{" "}
                <span className="text-foreground font-medium">PSNA College of Engineering & Technology</span>,
                passionate about building secure, scalable applications and exploring ethical hacking.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
              >
                <Button
                  asChild
                  size="lg"
                  className="btn-premium group bg-gradient-to-r from-primary to-cyan-400 hover:from-cyan-400 hover:to-primary transition-all duration-500 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                >
                  <Link to="/projects">
                    <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                    View My Work
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group border-primary/20 hover:bg-primary/8 hover:border-primary/40 transition-all duration-400"
                >
                  <Link to="/contact">
                    <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Get In Touch
                  </Link>
                </Button>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-4"
              >
                <span className="text-sm text-muted-foreground">Find me on</span>
                <div className="flex items-center gap-3">
                  {[
                    { href: "https://github.com/rs-ragul", icon: Github, label: "GitHub" },
                    { href: "https://www.linkedin.com/in/ragul-rs/", icon: Linkedin, label: "LinkedIn" },
                    { href: "mailto:rscreations.tech@gmail.com", icon: Mail, label: "Email" },
                  ].map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-muted/30 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/25 hover:bg-primary/8 transition-all duration-300"
                      aria-label={link.label}
                    >
                      <link.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Side - 3D Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-2 flex justify-center"
            >
              <div className="relative">
                {/* Rotating border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-[2px] rounded-3xl"
                  style={{
                    background:
                      "conic-gradient(from 0deg, hsl(187 85% 53% / 0.3), transparent, hsl(260 60% 60% / 0.2), transparent, hsl(174 72% 56% / 0.3))",
                  }}
                />
                {/* Card */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-3xl overflow-hidden border border-border/30">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(225 45% 9%) 0%, hsl(225 50% 5%) 100%)",
                    }}
                  />
                  <div className="relative h-full flex flex-col items-center justify-center p-8">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-6"
                    >
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/15 to-purple-500/10 border border-primary/20 flex items-center justify-center">
                        <Shield className="w-12 h-12 text-primary" />
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-center">
                      Ragul <span className="gradient-text">S</span>
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      CSE (Cyber Security)
                    </p>
                    <div className="flex items-center gap-2 text-xs text-primary/60">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      PSNA College of Engineering
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-5 justify-center">
                      {["React", "Python", "Linux", "Security"].map((tech, i) => (
                        <motion.span
                          key={tech}
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                          className="px-2.5 py-1 text-[10px] font-medium rounded-full bg-primary/8 border border-primary/15 text-primary/80"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-6 bg-primary/8 rounded-3xl blur-3xl -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground/60">Scroll</span>
          <ChevronDown className="w-4 h-4 text-primary/40" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
