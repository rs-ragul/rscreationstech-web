import { motion } from "framer-motion";
import { Package, FolderGit2, Code2, Shield, Award, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";

const iconMap = {
  apps: Package,
  projects: FolderGit2,
  downloads: Globe,
  users: Code2,
};

/* Animated counter */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  const { data: stats } = useQuery({
    queryKey: ["site-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const statsData = [
    {
      label: stats?.apps_label ?? "Apps Published",
      value: stats?.apps_count ?? 0,
      icon: "apps" as const,
      suffix: stats?.apps_suffix ?? "+",
    },
    {
      label: stats?.projects_label ?? "Projects Built",
      value: stats?.projects_count ?? 0,
      icon: "projects" as const,
      suffix: stats?.projects_suffix ?? "+",
    },
    {
      label: "Technologies",
      value: 15,
      icon: "downloads" as const,
      suffix: "+",
    },
  ];

  return (
    <section className="py-20 relative" id="stats">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            By the <span className="gradient-text">Numbers</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            A snapshot of my journey in software development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {statsData.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="stat-card text-center group glow-on-hover cursor-default relative overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                  >
                    <Icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <div className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
