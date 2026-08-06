import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Stat {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

const iconOptions = [
  { value: "package", label: "Package" },
  { value: "folder", label: "Folder" },
  { value: "download", label: "Download" },
  { value: "users", label: "Users" },
  { value: "code", label: "Code" },
  { value: "star", label: "Star" },
];

const AdminStats = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-site-stats"],
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

  const [statsList, setStatsList] = useState<Stat[]>([
    { label: "Apps Published", value: 0, suffix: "+", icon: "package" },
    { label: "Projects Built", value: 0, suffix: "+", icon: "folder" },
    { label: "Technologies", value: 15, suffix: "+", icon: "code" },
  ]);

  // Update form when data loads
  useEffect(() => {
    if (stats) {
      const statsArray: Stat[] = [];
      
      if (stats.apps_count !== undefined) {
        statsArray.push({
          label: stats.apps_label || "Apps Published",
          value: stats.apps_count || 0,
          suffix: stats.apps_suffix || "+",
          icon: "package",
        });
      }
      
      if (stats.projects_count !== undefined) {
        statsArray.push({
          label: stats.projects_label || "Projects Built",
          value: stats.projects_count || 0,
          suffix: stats.projects_suffix || "+",
          icon: "folder",
        });
      }
      
      if (stats.users_count !== undefined) {
        statsArray.push({
          label: stats.users_label || "Technologies",
          value: stats.users_count || 15,
          suffix: stats.users_suffix || "+",
          icon: "code",
        });
      }
      
      if (statsArray.length > 0) {
        setStatsList(statsArray);
      }
    }
  }, [stats]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      // Transform stats array back to database format
      const formData: any = {
        downloads_count: 0,
      };

      // Map stats to database columns
      if (statsList[0]) {
        formData.apps_label = statsList[0].label;
        formData.apps_count = statsList[0].value;
        formData.apps_suffix = statsList[0].suffix;
      }
      
      if (statsList[1]) {
        formData.projects_label = statsList[1].label;
        formData.projects_count = statsList[1].value;
        formData.projects_suffix = statsList[1].suffix;
      }
      
      if (statsList[2]) {
        formData.users_label = statsList[2].label;
        formData.users_count = statsList[2].value;
        formData.users_suffix = statsList[2].suffix;
      }

      if (stats?.id) {
        const { error } = await supabase
          .from("site_stats")
          .update(formData)
          .eq("id", stats.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_stats").insert([formData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-stats"] });
      queryClient.invalidateQueries({ queryKey: ["site-stats"] });
      toast({ title: "Stats updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update stats", variant: "destructive" });
    },
  });

  const addStat = () => {
    if (statsList.length >= 3) {
      toast({ title: "Maximum 3 stats allowed", variant: "destructive" });
      return;
    }
    setStatsList([...statsList, { label: "New Stat", value: 0, suffix: "+", icon: "star" }]);
  };

  const removeStat = (index: number) => {
    if (statsList.length <= 1) {
      toast({ title: "At least 1 stat required", variant: "destructive" });
      return;
    }
    setStatsList(statsList.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: keyof Stat, value: string | number) => {
    setStatsList(statsList.map((stat, i) => (i === index ? { ...stat, [field]: value } : stat)));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="glass-card p-6 space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Site Stats</h1>
        <p className="text-muted-foreground">Manage the stats displayed on the home page</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Stats Configuration</h2>
          <Button onClick={addStat} variant="outline" size="sm" disabled={statsList.length >= 3}>
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
        </div>

        <AnimatePresence>
          {statsList.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Stat {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
                  className="text-destructive hover:text-destructive"
                  disabled={statsList.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`label-${index}`}>Label</Label>
                  <Input
                    id={`label-${index}`}
                    value={stat.label}
                    onChange={(e) => updateStat(index, "label", e.target.value)}
                    placeholder="e.g., Apps Published"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`value-${index}`}>Value</Label>
                  <Input
                    id={`value-${index}`}
                    type="number"
                    value={stat.value}
                    onChange={(e) => updateStat(index, "value", parseInt(e.target.value) || 0)}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`suffix-${index}`}>Suffix</Label>
                  <Input
                    id={`suffix-${index}`}
                    value={stat.suffix}
                    onChange={(e) => updateStat(index, "suffix", e.target.value)}
                    placeholder="e.g., +"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`icon-${index}`}>Icon</Label>
                  <select
                    id={`icon-${index}`}
                    value={stat.icon}
                    onChange={(e) => updateStat(index, "icon", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          onClick={() => updateMutation.mutate()}
          className="w-full md:w-auto glow-primary"
          disabled={updateMutation.isPending}
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Stats"}
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statsList.map((stat, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStats;
