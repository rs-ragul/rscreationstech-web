import { motion } from "framer-motion";
import { Heart, Code2, Target, Lightbulb } from "lucide-react";

const journeyPoints = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "How It Started",
    description: "My journey in technology began with simple curiosity. Like many, I started by using computers and exploring software, but I wanted to understand how things work behind the scenes. That curiosity slowly turned into a genuine passion for building and creating.",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Learning to Build",
    description: "I started learning programming fundamentals - Python, C, C++, and then moved on to more complex technologies. Building my first applications gave me a sense of accomplishment that motivated me to learn more and build better.",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Discovering Cybersecurity",
    description: "While exploring how applications work, I became increasingly interested in how they can fail or be exploited. This curiosity led me to cybersecurity, where I'm learning to build more secure systems and understand the importance of protecting digital assets.",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Where I'm Headed",
    description: "My goal is to become a well-rounded technology professional with strong foundations in both development and security. I believe in steady progress through consistent learning rather than shortcuts. This website is a reflection of that journey.",
  },
];

export function JourneySection() {
  return (
    <section className="py-20 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 divider-grid opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            My <span className="gradient-text">Story</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The journey that led me to where I am today
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass p-8 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(222 47% 10% / 0.9), hsl(222 47% 6% / 0.7))',
              backdropFilter: 'blur(20px)',
              border: '1px solid hsl(222 30% 20% / 0.3)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {journeyPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                      {point.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

