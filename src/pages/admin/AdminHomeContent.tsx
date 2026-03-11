import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  defaultLearningData,
  defaultSkillCategories,
  type LearningIconKey,
  type LearningItem,
  type SkillCategory,
  type SkillIconKey,
  type SkillItem,
} from "@/lib/homeContentDefaults";

const learningIconOptions: Array<{ value: LearningIconKey; label: string }> = [
  { value: "network", label: "Network" },
  { value: "brain", label: "Brain" },
  { value: "database", label: "Database" },
  { value: "globe", label: "Globe" },
];

const skillsIconOptions: Array<{ value: SkillIconKey; label: string }> = [
  { value: "code2", label: "Code" },
  { value: "server", label: "Server" },
  { value: "wrench", label: "Tools" },
  { value: "shield", label: "Shield" },
];

const isLearningIconKey = (value: string): value is LearningIconKey =>
  value === "brain" || value === "network" || value === "database" || value === "globe";

const isSkillIconKey = (value: string): value is SkillIconKey =>
  value === "code2" || value === "server" || value === "wrench" || value === "shield";

const normalizeLearningData = (value: unknown): LearningItem[] => {
  if (!Array.isArray(value)) return defaultLearningData;

  const items = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as Record<string, unknown>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const description = typeof candidate.description === "string" ? candidate.description.trim() : "";
      const icon = typeof candidate.icon === "string" ? candidate.icon : "";
      const progress = Number(candidate.progress);

      if (!title || !description || !isLearningIconKey(icon) || Number.isNaN(progress)) return null;

      return {
        title,
        description,
        icon,
        progress: Math.max(0, Math.min(100, Math.round(progress))),
      } satisfies LearningItem;
    })
    .filter((item): item is LearningItem => Boolean(item));

  return items.length > 0 ? items : defaultLearningData;
};

const normalizeSkillsData = (value: unknown): SkillCategory[] => {
  if (!Array.isArray(value)) return defaultSkillCategories;

  const categories = value
    .map((category) => {
      if (!category || typeof category !== "object") return null;
      const candidate = category as Record<string, unknown>;
      const title = typeof candidate.title === "string" ? candidate.title.trim() : "";
      const icon = typeof candidate.icon === "string" ? candidate.icon : "";
      const skillsRaw = Array.isArray(candidate.skills) ? candidate.skills : [];

      if (!title || !isSkillIconKey(icon)) return null;

      const skills = skillsRaw
        .map((skill) => {
          if (!skill || typeof skill !== "object") return null;
          const skillCandidate = skill as Record<string, unknown>;
          const name = typeof skillCandidate.name === "string" ? skillCandidate.name.trim() : "";
          const level = Number(skillCandidate.level);
          if (!name || Number.isNaN(level)) return null;

          return {
            name,
            level: Math.max(0, Math.min(100, Math.round(level))),
          } satisfies SkillItem;
        })
        .filter((skill): skill is SkillItem => Boolean(skill));

      if (skills.length === 0) return null;

      return { title, icon, skills } satisfies SkillCategory;
    })
    .filter((category): category is SkillCategory => Boolean(category));

  return categories.length > 0 ? categories : defaultSkillCategories;
};

const AdminHomeContent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-home-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("id, learning_data, skills_data")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const [learningData, setLearningData] = useState<LearningItem[]>(defaultLearningData);
  const [skillsData, setSkillsData] = useState<SkillCategory[]>(defaultSkillCategories);

  useEffect(() => {
    if (!stats) return;
    setLearningData(normalizeLearningData(stats.learning_data));
    setSkillsData(normalizeSkillsData(stats.skills_data));
  }, [stats]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (learningData.length === 0) {
        throw new Error("Add at least one item in Currently Exploring.");
      }

      if (skillsData.length === 0) {
        throw new Error("Add at least one category in Skills & Technologies.");
      }

      const hasInvalidLearning = learningData.some((item) => !item.title.trim() || !item.description.trim());
      if (hasInvalidLearning) {
        throw new Error("Each Currently Exploring item needs title and description.");
      }

      const hasInvalidSkills = skillsData.some(
        (category) =>
          !category.title.trim() ||
          category.skills.length === 0 ||
          category.skills.some((skill) => !skill.name.trim()),
      );
      if (hasInvalidSkills) {
        throw new Error("Each skill category needs a title and at least one valid skill.");
      }

      if (stats?.id) {
        const { error } = await supabase
          .from("site_stats")
          .update({ learning_data: learningData, skills_data: skillsData })
          .eq("id", stats.id);

        if (error) throw error;
        return;
      }

      const { error } = await supabase.from("site_stats").insert([
        {
          learning_data: learningData,
          skills_data: skillsData,
        },
      ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-home-content"] });
      queryClient.invalidateQueries({ queryKey: ["site-home-content"] });
      toast({ title: "Home content updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update home content",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-64 bg-muted rounded" />
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  const addLearningItem = () => {
    setLearningData((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        icon: "network",
        progress: 50,
      },
    ]);
  };

  const removeLearningItem = (index: number) => {
    setLearningData((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLearningItem = (index: number, updater: (item: LearningItem) => LearningItem) => {
    setLearningData((prev) => prev.map((item, i) => (i === index ? updater(item) : item)));
  };

  const addSkillCategory = () => {
    setSkillsData((prev) => [
      ...prev,
      {
        title: "",
        icon: "code2",
        skills: [{ name: "", level: 50 }],
      },
    ]);
  };

  const removeSkillCategory = (categoryIndex: number) => {
    setSkillsData((prev) => prev.filter((_, i) => i !== categoryIndex));
  };

  const updateSkillCategory = (categoryIndex: number, updater: (category: SkillCategory) => SkillCategory) => {
    setSkillsData((prev) => prev.map((category, i) => (i === categoryIndex ? updater(category) : category)));
  };

  const addSkillItem = (categoryIndex: number) => {
    updateSkillCategory(categoryIndex, (category) => ({
      ...category,
      skills: [...category.skills, { name: "", level: 50 }],
    }));
  };

  const removeSkillItem = (categoryIndex: number, skillIndex: number) => {
    updateSkillCategory(categoryIndex, (category) => ({
      ...category,
      skills: category.skills.filter((_, i) => i !== skillIndex),
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Home Content</h1>
        <p className="text-muted-foreground">
          Edit the data used by the "Currently Exploring" and "Skills & Technologies" sections.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="glass-card p-6 space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Currently Exploring</h2>
              <p className="text-xs text-muted-foreground">Manage cards shown in the home section.</p>
            </div>
            <Button type="button" variant="outline" onClick={addLearningItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {learningData.map((item, index) => (
              <div key={`learning-${index}`} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Item {index + 1}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeLearningItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        updateLearningItem(index, (current) => ({ ...current, title: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <select
                      value={item.icon}
                      onChange={(e) =>
                        updateLearningItem(index, (current) => ({
                          ...current,
                          icon: e.target.value as LearningIconKey,
                        }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {learningIconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      updateLearningItem(index, (current) => ({ ...current, description: e.target.value }))
                    }
                    className="min-h-[90px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Progress (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={item.progress}
                    onChange={(e) =>
                      updateLearningItem(index, (current) => ({
                        ...current,
                        progress: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Skills & Technologies</h2>
              <p className="text-xs text-muted-foreground">Manage skill categories and skill levels.</p>
            </div>
            <Button type="button" variant="outline" onClick={addSkillCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="space-y-4">
            {skillsData.map((category, categoryIndex) => (
              <div key={`skills-${categoryIndex}`} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Category {categoryIndex + 1}</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => removeSkillCategory(categoryIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Category Title</Label>
                    <Input
                      value={category.title}
                      onChange={(e) =>
                        updateSkillCategory(categoryIndex, (current) => ({ ...current, title: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <select
                      value={category.icon}
                      onChange={(e) =>
                        updateSkillCategory(categoryIndex, (current) => ({
                          ...current,
                          icon: e.target.value as SkillIconKey,
                        }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {skillsIconOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Skills</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkillItem(categoryIndex)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>

                  {category.skills.map((skill, skillIndex) => (
                    <div key={`skill-${categoryIndex}-${skillIndex}`} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      <div className="md:col-span-7">
                        <Input
                          placeholder="Skill name"
                          value={skill.name}
                          onChange={(e) =>
                            updateSkillCategory(categoryIndex, (current) => ({
                              ...current,
                              skills: current.skills.map((s, i) =>
                                i === skillIndex ? { ...s, name: e.target.value } : s,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-3">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={skill.level}
                          onChange={(e) =>
                            updateSkillCategory(categoryIndex, (current) => ({
                              ...current,
                              skills: current.skills.map((s, i) =>
                                i === skillIndex
                                  ? {
                                      ...s,
                                      level: Math.max(0, Math.min(100, Number(e.target.value) || 0)),
                                    }
                                  : s,
                              ),
                            }))
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="w-full text-destructive hover:bg-destructive/10"
                          onClick={() => removeSkillItem(categoryIndex, skillIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={saveMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? "Saving..." : "Save Home Content"}
        </Button>
      </motion.form>
    </div>
  );
};

export default AdminHomeContent;
