import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";

interface EducationEntry {
  title: string;
  institution: string;
  period: string;
  description?: string;
  type: "education" | "certification";
}

const educationData: EducationEntry[] = [
  {
    title: "Computer Science Engineering (Cyber Security)",
    institution: "PSNA College of Engineering and Technology",
    period: "2025 - Present",
    type: "education",
    description: "Currently pursuing B.E. in Computer Science with specialization in Cyber Security. Learning fundamental concepts of computer science along with security principles.",
  },
  {
    title: "Higher Secondary Education",
    institution: "Srinivasa Matriculation Hr Sec School, Kollidam",
    period: "2023 - 2025",
    type: "education",
    description: "Completed higher secondary education with focus on Mathematics and Computer Science.",
  },
  {
    title: "SSLC",
    institution: "Srinivasa Matriculation Hr Sec School, Kollidam",
    period: "2022 - 2023",
    type: "education",
    description: "Completed secondary school education with outstanding marks.",
  },
];

export function EducationTimeline() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Education <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            My academic background and educational milestones
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="timeline-line hidden md:block" />

            <div className="space-y-8">
              {educationData.map((entry, index) => (
                <motion.div
                  key={entry.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative flex gap-6 md:pl-12"
                >
                  {/* Timeline dot */}
                  <div className="timeline-dot mt-6 hidden md:block flex-shrink-0" />
                  
                  {/* Content card */}
                  <div className="glass-card p-6 flex-1 glass-card-hover">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{entry.title}</h3>
                          <span className="text-sm text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-full">
                            {entry.period}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2">{entry.institution}</p>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground/80">
                            {entry.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

