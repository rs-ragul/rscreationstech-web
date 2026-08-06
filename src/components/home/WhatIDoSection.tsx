import { motion } from "framer-motion";
import { Code2, Shield, Globe, Palette, Server, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: <Code2 className="w-7 h-7" />,
    title: "Full Stack Development",
    description: "Building modern web applications with React, TypeScript, Node.js, and Supabase. From responsive UIs to secure backend APIs.",
    color: "blue",
    link: "/projects",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Cybersecurity",
    description: "Exploring ethical hacking, penetration testing, and network security. Building secure applications with security-first mindset.",
    color: "red",
    link: "/about",
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: "Web Applications",
    description: "Creating user-friendly, performant web apps with modern architectures — from admin panels to consumer-facing platforms.",
    color: "green",
    link: "/apps",
  },
  {
    icon: <Palette className="w-7 h-7" />,
    title: "UI/UX Design",
    description: "Designing clean, intuitive interfaces with attention to user experience. Crafting beautiful, responsive designs that work everywhere.",
    color: "purple",
    link: "/projects",
  },
  {
    icon: <Server className="w-7 h-7" />,
    title: "Backend & APIs",
    description: "Designing RESTful APIs, database schemas, and server-side logic. Working with PostgreSQL, Supabase, and Node.js ecosystems.",
    color: "amber",
    link: "/projects",
  },
  {
    icon: <Terminal className="w-7 h-7" />,
    title: "DevOps & Tools",
    description: "Working with Git, Linux, Docker, and CI/CD pipelines. Automating workflows and maintaining development environments.",
    color: "teal",
    link: "/about",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", glow: "group-hover:shadow-blue-500/10" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", glow: "group-hover:shadow-red-500/10" },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", glow: "group-hover:shadow-green-500/10" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", glow: "group-hover:shadow-purple-500/10" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "group-hover:shadow-amber-500/10" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", glow: "group-hover:shadow-teal-500/10" },
};

export function WhatIDoSection() {
  return (
    <section className="py-28 relative overflow-hidden" id="what-i-do">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(225 45% 8%) 0%, hsl(225 50% 5%) 100%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What I <span className="gradient-text">Do</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From building applications to exploring security — here's what I focus on
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const colors = colorMap[service.color];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link to={service.link} className="block h-full">
                  <div className={`group glass-card p-7 h-full glass-card-hover animated-border relative overflow-hidden ${colors.glow}`}>
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} mb-5 group-hover:scale-110 transition-transform duration-500`}>
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
