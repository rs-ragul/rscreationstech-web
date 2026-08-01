import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminBlogForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = id && id !== "new";

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_urls: [] as string[],
    is_published: false,
    published_at: null as string | null,
  });
  const [imagesUploading, setImagesUploading] = useState(false);

  const { data: post, isLoading } = useQuery({
    queryKey: ["admin-blog-post", id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        cover_image_urls: post.cover_image_urls?.length
          ? post.cover_image_urls
          : post.cover_image_url
            ? [post.cover_image_url]
            : [],
        is_published: post.is_published || false,
        published_at: post.published_at,
      });
    }
  }, [post]);

  useEffect(() => {
    if (!isEditing && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }, [formData.title, isEditing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const dataToSave = {
        ...formData,
        cover_image_url: formData.cover_image_urls[0] || null,
        published_at: formData.is_published && !formData.published_at 
          ? new Date().toISOString() 
          : formData.published_at,
      };

      if (isEditing) {
        const { error } = await supabase.from("blog_posts").update(dataToSave).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert([dataToSave]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: isEditing ? "Post updated successfully" : "Post created successfully" });
      navigate("/rscraft/blog");
    },
    onError: (error: any) => {
      toast({ title: "Failed to save post", description: error.message, variant: "destructive" });
    },
  });

  const uploadImages = async (files: FileList) => {
    try {
      setImagesUploading(true);
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `blog/${fileName}`;

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
          cover_image_urls: [...prev.cover_image_urls, ...uploadedUrls],
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
    setFormData((prev) => ({
      ...prev,
      cover_image_urls: prev.cover_image_urls.filter((_, index) => index !== indexToRemove),
    }));
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="glass-card p-6 space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
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
          <Link to="/rscraft/blog">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? "Edit Post" : "New Post"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update blog post" : "Write a new blog post"}
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
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Post title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              placeholder="post-slug"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief summary of the post..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_images">Cover Images</Label>
            <div className="flex items-center gap-2">
              <Input
                id="cover_images"
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
            {formData.cover_image_urls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {formData.cover_image_urls.map((imageUrl, index) => (
                  <div key={`${imageUrl}-${index}`} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Uploaded cover ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
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

          <div className="flex items-center gap-3">
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
            />
            <Label htmlFor="is_published">Publish Post</Label>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Content</h2>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write your post content here... (Markdown supported)"
            rows={20}
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/rscraft/blog">Cancel</Link>
          </Button>
          <Button type="submit" className="glow-primary" disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminBlogForm;
