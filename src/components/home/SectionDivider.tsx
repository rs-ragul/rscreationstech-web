import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "gradient" | "grid" | "glow";
}

export function SectionDivider({ variant = "gradient" }: SectionDividerProps) {
  if (variant === "grid") {
    return (
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 divider-grid animate-grid-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    );
  }

  if (variant === "glow") {
    return (
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-64 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(187 85% 53% / 0.8), hsl(174 72% 56% / 0.8), hsl(187 85% 53% / 0.8), transparent)',
              boxShadow: '0 0 20px hsl(187 85% 53% / 0.5)',
            }}
          />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    );
  }

  // Default gradient divider
  return (
    <div className="relative h-16 overflow-hidden">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="divider-gradient mx-auto max-w-xl" />
      </div>
    </div>
  );
}

