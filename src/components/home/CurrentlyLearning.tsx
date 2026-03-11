import { motion } from "framer-motion";
import { Brain, Network, Database, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  defaultLearningData,
  type LearningItem,
  type LearningIconKey,
} from "@/lib/homeContentDefaults";

const iconMap: Record<LearningIconKey, React.ReactNode> = {
  brain: <Brain className="w-6 h-6" />,
  network: <Network className="w-6 h-6" />,
  database: <Database className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
};

const isLearningIconKey = (value: string): value is LearningIconKey =>
  value === "brain" || value === "network" || value === "database" || value === "globe";

const normalizeLearningData = (value: unknown): LearningItem[] => {
  if (!Array.isArray(value)) return defaultLearningData;

  const normalized = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Record<string, unknown>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
      const progressValue = Number(candidate.progress);
      const iconValue = typeof candidate.icon === "string" ? candidate.icon : "";

      if (!title || !description || !isLearningIconKey(iconValue) || Number.isNaN(progressValue)) {
        return null;
      }

      return {
        title,
        description,
        icon: iconValue,
        progress: Math.max(0, Math.min(100, Math.round(progressValue))),
      } satisfies LearningItem;
    })
    .filter((item): item is LearningItem => Boolean(item));

  return normalized.length > 0 ? normalized : defaultLearningData;
};

export function CurrentlyLearning() {
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

  const learningData = normalizeLearningData(stats?.learning_data);

  return (
    <section className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Learning Journey</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Currently <span className="gradient-text">Exploring</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Areas of technology I'm currently learning and deepening my knowledge in
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {learningData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-6 glass-card-hover group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  {iconMap[item.icon]}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs text-primary font-medium">{item.progress}%</span>
                </div>
                <div className="skill-bar h-1.5">
                  <motion.div
                    className="skill-bar-fill h-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

