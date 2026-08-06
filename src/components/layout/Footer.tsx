import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, Heart, ArrowUp } from "lucide-react";

const footerLinks = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/apps", label: "Apps" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/disclaimer", label: "Disclaimer" },
  ],
};

const socialLinks = [
  { href: "https://github.com/rs-ragul", icon: Github, label: "GitHub" },
  { href: "https://www.instagram.com/rscreations.tech/", icon: Instagram, label: "Instagram" },
  { href: "https://www.linkedin.com/in/ragul-rs/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:rscreations.tech@gmail.com", icon: Mail, label: "Email" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-card/50 border-t border-border/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 group mb-4">
              <div className="relative">
                <img
                  src="/rscreationslogo.ico"
                  alt="Ragul S - Portfolio"
                  className="w-9 h-9 rounded-lg transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base leading-tight group-hover:text-primary transition-colors">
                  Ragul S
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  Developer & Creator
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
              Full Stack Developer & Cybersecurity Enthusiast. Building secure, innovative
              web applications and exploring the world of ethical hacking. Based in Tamil Nadu, India.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const isExternal = link.href.startsWith("http");
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
                    aria-label={link.label}
                  >
                    <link.icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Navigation</h4>
            <ul className="space-y-2.5">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-all duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {currentYear} Ragul S. Built with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> and lots of code.
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to top
            <motion.span
              whileHover={{ y: -2 }}
              className="w-8 h-8 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center group-hover:border-primary/30 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </footer>
  );
}
