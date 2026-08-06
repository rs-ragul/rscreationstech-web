import { motion } from "framer-motion";
import { Brain, Network, Database, Globe, Sparkles } from "lucide-react";
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
      const iconValue = typeof candidate.icon === "string" ? candidate.icon : "";

      if (!title || !description || !isLearningIconKey(iconValue)) return null;

      return {
        title,
        description,
        icon: iconValue,
        progress: 0,
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
    <section className="py-28 relative overflow-hidden" id="learning">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, hsl(187 85% 53% / 0.04) 0%, transparent 60%)",
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
            <Sparkles className="w-4 h-4" />
            Always Growing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Currently <span className="gradient-text">Exploring</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Areas of technology I'm actively learning and deepening my expertise in
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {learningData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group glass-card p-6 md:p-8 glass-card-hover animated-border relative overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0"
                  >
                    {iconMap[item.icon]}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
