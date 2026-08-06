import { motion } from "framer-motion";
import { Code2, Server, Wrench, Shield, Cpu } from "lucide-react";
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

const categoryStyles: Record<string, { gradient: string; badge: string; iconBg: string }> = {
  Frontend: {
    gradient: "from-blue-500/10 to-cyan-500/5",
    badge: "bg-blue-500/8 text-blue-300/90 border-blue-500/15 hover:border-blue-500/30 hover:bg-blue-500/12",
    iconBg: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
  },
  Backend: {
    gradient: "from-emerald-500/10 to-green-500/5",
    badge: "bg-emerald-500/8 text-emerald-300/90 border-emerald-500/15 hover:border-emerald-500/30 hover:bg-emerald-500/12",
    iconBg: "from-emerald-500/20 to-green-500/10 border-emerald-500/20",
  },
  Tools: {
    gradient: "from-amber-500/10 to-orange-500/5",
    badge: "bg-amber-500/8 text-amber-300/90 border-amber-500/15 hover:border-amber-500/30 hover:bg-amber-500/12",
    iconBg: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
  },
  Security: {
    gradient: "from-rose-500/10 to-red-500/5",
    badge: "bg-rose-500/8 text-rose-300/90 border-rose-500/15 hover:border-rose-500/30 hover:bg-rose-500/12",
    iconBg: "from-rose-500/20 to-red-500/10 border-rose-500/20",
  },
};

const defaultStyle = {
  gradient: "from-primary/10 to-cyan-500/5",
  badge: "bg-primary/8 text-primary/90 border-primary/15 hover:border-primary/30 hover:bg-primary/12",
  iconBg: "from-primary/20 to-cyan-500/10 border-primary/20",
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
          if (!name) return null;
          return { name, level: 0 };
        })
        .filter((skill): skill is { name: string; level: number } => Boolean(skill));

      if (skills.length === 0) return null;
      return { title, icon: iconValue, skills } satisfies SkillCategory;
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
    <section className="py-28 relative overflow-hidden" id="skills">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 divider-grid opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, hsl(187 85% 53% / 0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, hsl(174 72% 56% / 0.02) 0%, transparent 50%)",
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
            <Cpu className="w-4 h-4" />
            Tech Stack
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            The tools and technologies I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {skillCategories.map((category, categoryIndex) => {
            const style = categoryStyles[category.title] || defaultStyle;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="group glass-card p-6 md:p-8 glass-card-hover animated-border relative overflow-hidden"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center text-primary`}>
                      {iconMap[category.icon]}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{category.title}</h3>
                      <p className="text-xs text-muted-foreground">{category.skills.length} technologies</p>
                    </div>
                  </div>

                  {/* Skills - Clean badges, no progress */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: categoryIndex * 0.1 + skillIndex * 0.04 }}
                        className={`px-3.5 py-1.5 text-sm font-medium rounded-lg border transition-all duration-300 cursor-default ${style.badge}`}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Extra tech tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto"
        >
          {[
            "Supabase", "PostgreSQL", "REST APIs", "Git", "Vite", "TailwindCSS",
            "Framer Motion", "Node.js", "Express", "Linux", "Kali Linux", "Burp Suite",
          ].map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.03 }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/40 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/20 transition-all duration-300 cursor-default"
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
