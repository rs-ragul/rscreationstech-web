import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = id && id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    tech_stack: [] as string[],
    github_url: "",
    live_url: "",
    image_url: "",
    image_urls: [] as string[],
  });
  const [newTech, setNewTech] = useState("");
  const [imagesUploading, setImagesUploading] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        slug: project.slug || "",
        description: project.description || "",
        tech_stack: project.tech_stack || [],
        github_url: project.github_url || "",
        live_url: project.live_url || "",
        image_url: project.image_url || "",
        image_urls: project.image_urls?.length
          ? project.image_urls
          : project.image_url
            ? [project.image_url]
            : [],
      });
    }
  }, [project]);

  useEffect(() => {
    if (!isEditing && formData.name) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }, [formData.name, isEditing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const dataToSave = {
        ...formData,
        image_url: formData.image_urls[0] || null,
      };

      if (isEditing) {
        const { error } = await supabase.from("projects").update(dataToSave).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert([dataToSave]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast({ title: isEditing ? "Project updated successfully" : "Project created successfully" });
      navigate("/rscraft/projects");
    },
    onError: (error: any) => {
      toast({ title: "Failed to save project", description: error.message, variant: "destructive" });
    },
  });

  const addTech = () => {
    if (newTech.trim()) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...prev.tech_stack, newTech.trim()],
      }));
      setNewTech("");
    }
  };

  const removeTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((_, i) => i !== index),
    }));
  };

  const uploadImages = async (files: FileList) => {
    try {
      setImagesUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `project/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("app-assets")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("app-assets").getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          image_urls: [...prev.image_urls, ...uploadedUrls],
          image_url: prev.image_urls[0] || uploadedUrls[0] || "",
        }));
        toast({ title: "Images uploaded successfully" });
      }
    } catch (error: any) {
      toast({
        title: "Failed to upload images",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImagesUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData((prev) => {
      const nextImages = prev.image_urls.filter((_, index) => index !== indexToRemove);

      return {
        ...prev,
        image_urls: nextImages,
        image_url: nextImages[0] || "",
      };
    });
  };

  const makeImageCover = (indexToPromote: number) => {
    setFormData((prev) => {
      if (indexToPromote === 0 || indexToPromote >= prev.image_urls.length) {
        return prev;
      }

      const nextImages = [...prev.image_urls];
      const [selectedImage] = nextImages.splice(indexToPromote, 1);
      nextImages.unshift(selectedImage);

      return {
        ...prev,
        image_urls: nextImages,
        image_url: nextImages[0] || "",
      };
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="glass-card p-6 space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" asChild>
          <Link to="/rscraft/projects">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? "Edit Project" : "New Project"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update project details" : "Add a new project"}
          </p>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="space-y-6"
      >
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="My Project"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="my-project"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Project description..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="live_url">Live URL</Label>
              <Input
                id="live_url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_images">Project Images</Label>
            <div className="flex items-center gap-2">
              <Input
                id="project_images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    uploadImages(e.target.files);
                    e.target.value = "";
                  }
                }}
                disabled={imagesUploading}
              />
              {imagesUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <Upload className="w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {formData.image_urls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {formData.image_urls.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Uploaded project ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                    <div className="absolute left-1 top-1 flex gap-2">
                      {index === 0 ? (
                        <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makeImageCover(index)}
                          className="rounded-full bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground shadow-sm transition-colors hover:bg-background"
                        >
                          Make cover
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Tech Stack</h2>
          
          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
            />
            <Button type="button" onClick={addTech} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tech_stack.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm"
                >
                  {tech}
                  <button type="button" onClick={() => removeTech(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/rscraft/projects">Cancel</Link>
          </Button>
          <Button type="submit" className="glow-primary" disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminProjectForm;
