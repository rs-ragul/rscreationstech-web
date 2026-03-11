import { motion } from "framer-motion";
import { Code2, Server, Wrench, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  defaultSkillCategories,
  type SkillCategory,
  type SkillIconKey,
} from "@/lib/homeContentDefaults";

const iconMap: Record<SkillIconKey, React.ReactNode> = {
  code2: <Code2 className="w-5 h-5" />,
  server: <Server className="w-5 h-5" />,
  wrench: <Wrench className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
};

const isSkillIconKey = (value: string): value is SkillIconKey =>
  value === "code2" || value === "server" || value === "wrench" || value === "shield";

const normalizeSkillCategories = (value: unknown): SkillCategory[] => {
  if (!Array.isArray(value)) return defaultSkillCategories;

  const normalized = value
    .map((category) => {
      if (!category || typeof category !== "object") return null;
      const candidate = category as Record<string, unknown>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const iconValue = typeof candidate.icon === "string" ? candidate.icon : "";
      const skillsRaw = Array.isArray(candidate.skills) ? candidate.skills : [];

      if (!title || !isSkillIconKey(iconValue) || skillsRaw.length === 0) return null;

      const skills = skillsRaw
        .map((skill) => {
          if (!skill || typeof skill !== "object") return null;
          const skillCandidate = skill as Record<string, unknown>;
          const name = typeof skillCandidate.name === "string" ? skillCandidate.name.trim() : "";
          const levelValue = Number(skillCandidate.level);

          if (!name || Number.isNaN(levelValue)) return null;

          return {
            name,
            level: Math.max(0, Math.min(100, Math.round(levelValue))),
          };
        })
        .filter((skill): skill is { name: string; level: number } => Boolean(skill));

      if (skills.length === 0) return null;

      return {
        title,
        icon: iconValue,
        skills,
      } satisfies SkillCategory;
    })
    .filter((category): category is SkillCategory => Boolean(category));

  return normalized.length > 0 ? normalized : defaultSkillCategories;
};

export function SkillsSection() {
  const { data: stats } = useQuery({
    queryKey: ["site-home-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("learning_data, skills_data")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const skillCategories = normalizeSkillCategories(stats?.skills_data);

  return (
    <section className="py-20 relative">
      {/* Background decorations */}
      <div className="absolute inset-0 divider-grid opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A comprehensive overview of my technical skills and tools I work with
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="glass-card p-6 glass-card-hover"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  {iconMap[category.icon]}
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="skill-bar h-2">
                      <motion.div
                        className="skill-bar-fill h-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

