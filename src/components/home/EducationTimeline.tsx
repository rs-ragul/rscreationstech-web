import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen } from "lucide-react";

interface EducationEntry {
  title: string;
  institution: string;
  period: string;
  description?: string;
  type: "education" | "certification";
  grade?: string;
  gradeLabel?: string;
}

const educationData: EducationEntry[] = [
  {
    title: "B.E. Computer Science Engineering (Cyber Security)",
    institution: "PSNA College of Engineering and Technology",
    period: "2025 - Present",
    type: "education",
    description:
      "Currently pursuing B.E. in Computer Science with specialization in Cyber Security. Gaining strong foundations in software development, networking, and security principles.",
  },
  {
    title: "Higher Secondary Education (12th)",
    institution: "Srinivasa Matriculation Hr Sec School, Kollidam",
    period: "2023 - 2025",
    type: "education",
    description:
      "Completed higher secondary education with focus on Mathematics and Computer Science. Developed strong analytical and problem-solving skills.",
    grade: "90.6%",
    gradeLabel: "Percentage",
  },
  {
    title: "SSLC (10th)",
    institution: "Srinivasa Matriculation Hr Sec School, Kollidam",
    period: "2022 - 2023",
    type: "education",
    description:
      "Completed secondary school education with outstanding academic performance, laying the foundation for a career in technology.",
  },
];

export function EducationTimeline() {
  return (
    <section className="py-28 relative overflow-hidden" id="education">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, hsl(187 85% 53% / 0.03) 0%, transparent 50%)",
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
          <div className="section-badge mb-6">
            <BookOpen className="w-4 h-4" />
            Academic Journey
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Education <span className="gradient-text">Timeline</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            My academic background and educational milestones
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="relative">
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
                  <div className="timeline-dot mt-6 hidden md:block flex-shrink-0" />

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="glass-card p-6 md:p-7 flex-1 glass-card-hover animated-border"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0">
                        {entry.type === "certification" ? (
                          <Award className="w-6 h-6 text-primary" />
                        ) : (
                          <GraduationCap className="w-6 h-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{entry.title}</h3>
                          <span className="text-sm text-primary bg-primary/8 border border-primary/15 px-3 py-1 rounded-lg w-fit">
                            {entry.period}
                          </span>
                        </div>
                        <p className="text-muted-foreground mb-2 font-medium text-sm">
                          {entry.institution}
                        </p>
                        {entry.description && (
                          <p className="text-sm text-muted-foreground/80 leading-relaxed">
                            {entry.description}
                          </p>
                        )}
                        {entry.grade && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/8 border border-green-500/15"
                          >
                            <Award className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-400">
                              {entry.gradeLabel}: {entry.grade}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
