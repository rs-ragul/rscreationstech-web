import { motion } from "framer-motion";
import { Heart, Code2, Target, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const journeyPoints = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "How It Started",
    description:
      "My journey in technology began with simple curiosity — exploring computers, understanding how software works behind the scenes, and wanting to build things of my own.",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Learning to Build",
    description:
      "I started with programming fundamentals — Python, C, C++ — then moved to full-stack web development with React, TypeScript, and modern tooling. Each project taught me something new.",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Discovering Cybersecurity",
    description:
      "While building applications, I became fascinated with how systems can fail or be exploited. This led me to ethical hacking, penetration testing, and network security.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Where I'm Headed",
    description:
      "My goal is to become a well-rounded security-focused developer — building systems that are not just functional but also secure, scalable, and impactful.",
  },
];

export function JourneySection() {
  return (
    <section className="py-24 relative overflow-hidden" id="journey">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 80%, hsl(187 85% 53% / 0.04) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 divider-grid opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Story</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The journey that shaped me as a developer and cybersecurity enthusiast
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass p-8 md:p-10 rounded-2xl relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, hsl(222 47% 10% / 0.9), hsl(222 47% 6% / 0.7))",
              backdropFilter: "blur(20px)",
              border: "1px solid hsl(222 30% 20% / 0.3)",
            }}
          >
            {/* Decorative corner glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {journeyPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300"
                    >
                      {point.icon}
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-10"
          >
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-primary hover:text-cyan-400 font-medium transition-colors group"
            >
              Read my full story
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
