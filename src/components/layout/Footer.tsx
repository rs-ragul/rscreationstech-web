import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

const footerLinks = {
  navigation: [
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

  return (
    <footer className="bg-card/50 border-t border-border/50 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="relative">
                <img
                  src="/rscreationslogo.ico"
                  alt="RS Creations Tech Logo"
                  className="w-9 h-9 rounded-lg transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
              </div>
              <span className="font-semibold text-lg group-hover:text-primary transition-colors">RS Creations Tech</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              Building innovative software solutions and sharing knowledge with the developer community.
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 glow-on-hover"
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
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} RS Creations Tech. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  );
}
