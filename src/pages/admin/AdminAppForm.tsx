import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Plus, X, Image, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminAppForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isEditing = id && id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    title: "",
    short_description: "",
    description: "",
    instructions: "",
    features: [] as string[],
    apk_url: "",
    logo_url: "",
    version: "1.0.0",
    version_code: 1,
    force_update: false,
    changelog: "",
    is_featured: false,
    is_upcoming: false,
    release_at: "",
  });
  const [newFeature, setNewFeature] = useState("");
  const [images, setImages] = useState<{ id?: string; image_url: string; alt_text: string }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [appFile, setAppFile] = useState<File | null>(null);
  const [appFileUploading, setAppFileUploading] = useState(false);
  const [versionJsonUploading, setVersionJsonUploading] = useState(false);

  const toDateTimeLocal = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  };

  // Fetch app data if editing
  const { data: app, isLoading } = useQuery({
    queryKey: ["admin-app", id],
    queryFn: async () => {
      if (!isEditing) return null;
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Fetch app images
  const { data: appImages } = useQuery({
    queryKey: ["admin-app-images", id],
    queryFn: async () => {
      if (!isEditing) return [];
      const { data, error } = await supabase
        .from("app_images")
        .select("*")
        .eq("app_id", id)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || "",
        slug: app.slug || "",
        title: app.title || "",
        short_description: app.short_description || "",
        description: app.description || "",
        instructions: app.instructions || "",
        features: app.features || [],
        apk_url: "",
        logo_url: app.logo_url || "",
        version: app.version || "1.0.0",
        version_code: 1,
        force_update: false,
        changelog: "",
        is_featured: app.is_featured || false,
        is_upcoming: app.is_upcoming || false,
        release_at: app.release_at || "",
      });
    }
  }, [app]);

  useEffect(() => {
    if (!app?.slug) return;
    let isActive = true;

    const loadVersionMetadata = async () => {
      try {
        const versionUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/app-assets/downloads/${app.slug}/version.json`;
        const response = await fetch(versionUrl, { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!isActive || !data) return;

        const apkUrlFromJson = typeof data.apkUrl === "string" ? data.apkUrl : "";
        const downloadUrlFromJson = typeof data.downloadUrl === "string" ? data.downloadUrl : "";
        const legacyApkUrl = downloadUrlFromJson.endsWith(".apk") ? downloadUrlFromJson : "";

        setFormData((prev) => ({
          ...prev,
          version_code: typeof data.versionCode === "number" ? data.versionCode : prev.version_code,
          force_update: typeof data.forceUpdate === "boolean" ? data.forceUpdate : prev.force_update,
          changelog: typeof data.changelog === "string" ? data.changelog : prev.changelog,
          apk_url: apkUrlFromJson || legacyApkUrl || prev.apk_url,
        }));
      } catch (error) {
        console.warn("Failed to load version.json:", error);
      }
    };

    loadVersionMetadata();

    return () => {
      isActive = false;
    };
  }, [app?.slug]);

  useEffect(() => {
    if (appImages) {
      setImages(appImages.map((img) => ({
        id: img.id,
        image_url: img.image_url,
        alt_text: img.alt_text || "",
      })));
    }
  }, [appImages]);

  // Auto-generate slug from name
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
      const failWith = (label: string, error: any) => {
        const message = error?.message || String(error);
        throw new Error(`${label}: ${message}`);
      };

      const appPayload = {
        name: formData.name,
        slug: formData.slug,
        title: formData.title,
        short_description: formData.short_description,
        description: formData.description,
        instructions: formData.instructions,
        features: formData.features,
        download_url: formData.slug ? `/apps/${formData.slug}` : null,
        logo_url: formData.logo_url,
        version: formData.version,
        is_featured: formData.is_featured,
        is_upcoming: formData.is_upcoming,
        release_at: formData.release_at ? formData.release_at : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from("apps")
          .update(appPayload)
          .eq("id", id);
        if (error) failWith("Apps update failed", error);

        // Update images
        await supabase.from("app_images").delete().eq("app_id", id);
        if (images.length > 0) {
          const { error: imgError } = await supabase.from("app_images").insert(
            images.map((img, index) => ({
              app_id: id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              sort_order: index,
            }))
          );
          if (imgError) failWith("App images insert failed", imgError);
        }

        try {
          await uploadVersionFile(formData.slug);
        } catch (error) {
          failWith("version.json upload failed", error);
        }
      } else {
        const { data, error } = await supabase
          .from("apps")
          .insert([appPayload])
          .select()
          .single();
        if (error) failWith("Apps insert failed", error);

        // Add images
        if (images.length > 0) {
          const { error: imgError } = await supabase.from("app_images").insert(
            images.map((img, index) => ({
              app_id: data.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              sort_order: index,
            }))
          );
          if (imgError) failWith("App images insert failed", imgError);
        }

        try {
          await uploadVersionFile(formData.slug);
        } catch (error) {
          failWith("version.json upload failed", error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-apps"] });
      toast({ title: isEditing ? "App updated successfully" : "App created successfully" });
      navigate("/rscraft/apps");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to save app", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, { image_url: newImageUrl.trim(), alt_text: "" }]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadLogo = async (file: File) => {
    try {
      setLogoUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("app-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("app-assets").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, logo_url: data.publicUrl }));
      toast({ title: "Logo uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Failed to upload logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLogoUploading(false);
    }
  };

  const uploadScreenshot = async (file: File) => {
    try {
      setScreenshotUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("app-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("app-assets").getPublicUrl(filePath);
      setImages((prev) => [...prev, { image_url: data.publicUrl, alt_text: "" }]);
      toast({ title: "Screenshot uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Failed to upload screenshot",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScreenshotUploading(false);
    }
  };

  const uploadAppFile = async () => {
    if (!appFile) {
      toast({
        title: "Select a file first",
        description: "Choose an app file to upload.",
        variant: "destructive",
      });
      return;
    }
    const lowerName = appFile.name.toLowerCase();
    if (!lowerName.endsWith(".apk")) {
      toast({
        title: "Invalid file type",
        description: "Only .apk files are allowed for app updates.",
        variant: "destructive",
      });
      return;
    }

    try {
      setAppFileUploading(true);
      const safeName = appFile.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      const fileName = `${Date.now()}-${safeName}`;
      const filePath = `downloads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("app-assets")
        .upload(filePath, appFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("app-assets").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, apk_url: data.publicUrl }));
      toast({ title: "App file uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Failed to upload app file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAppFileUploading(false);
    }
  };

  const ensureAuthSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session) return data.session;

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) throw refreshError;
    if (!refreshed.session) {
      throw new Error("Admin session expired. Please sign in again.");
    }

    return refreshed.session;
  };

  const buildVersionPayload = () => ({
    versionCode: Number(formData.version_code) || 1,
    versionName: formData.version || "",
    downloadUrl:
      formData.slug && typeof window !== "undefined"
        ? `${window.location.origin}/apps/${formData.slug}`
        : formData.slug
          ? `/apps/${formData.slug}`
          : "",
    apkUrl: formData.apk_url || "",
    forceUpdate: !!formData.force_update,
    changelog: formData.changelog || "",
  });

  const uploadVersionFile = async (slugValue: string) => {
    if (!slugValue) return;

    await ensureAuthSession();

    const versionPath = `downloads/${slugValue}/version.json`;
    const payload = JSON.stringify(buildVersionPayload(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });

    const { error: uploadError } = await supabase.storage
      .from("app-assets")
      .upload(versionPath, blob, {
        contentType: "application/json",
        cacheControl: "60",
        upsert: true,
      });

    if (uploadError) throw uploadError;
  };

  const updateVersionJson = async () => {
    if (!formData.slug) {
      toast({
        title: "Missing slug",
        description: "Enter a slug before updating version.json.",
        variant: "destructive",
      });
      return;
    }

    try {
      setVersionJsonUploading(true);
      await uploadVersionFile(formData.slug);
      toast({ title: "version.json updated" });
    } catch (error: any) {
      toast({
        title: "Failed to update version.json",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setVersionJsonUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="glass-card p-6 space-y-4">
          <div className="h-10 bg-muted rounded" />
          <div className="h-10 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" asChild>
          <Link to="/rscraft/apps">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditing ? "Edit App" : "New App"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update app details" : "Add a new application"}
          </p>
        </div>
      </motion.div>

      {/* Form */}
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
        {/* Basic Info */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">App Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="My Awesome App"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="my-awesome-app"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="The Ultimate Productivity Tool"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Input
              id="short_description"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="A brief description for app listings"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of your app..."
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="1.0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_upcoming">Release Status</Label>
              <div className="flex items-center gap-3">
                <Switch
                  id="is_upcoming"
                  checked={formData.is_upcoming}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_upcoming: checked,
                      apk_url: checked ? "" : prev.apk_url,
                    }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  Mark as upcoming (no download yet)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version_code">Version Code</Label>
              <Input
                id="version_code"
                type="number"
                min={1}
                value={formData.version_code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    version_code: Number(e.target.value) || 1,
                  })
                }
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="force_update">Force Update</Label>
              <div className="flex items-center gap-3">
                <Switch
                  id="force_update"
                  checked={formData.force_update}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      force_update: checked,
                    }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  Require users to update
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="changelog">Changelog</Label>
            <Textarea
              id="changelog"
              value={formData.changelog}
              onChange={(e) => setFormData({ ...formData, changelog: e.target.value })}
              placeholder="Short update notes for in-app updates"
              rows={3}
            />
          </div>

          {formData.is_upcoming ? (
            <div className="space-y-2">
              <Label htmlFor="release_at">Release Date & Time</Label>
              <Input
                id="release_at"
                type="datetime-local"
                value={toDateTimeLocal(formData.release_at)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    release_at: e.target.value ? new Date(e.target.value).toISOString() : "",
                  })
                }
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="app_file">APK File (for updates)</Label>
              <div className="flex gap-2">
                <Input
                  id="app_file"
                  type="file"
                  accept=".apk"
                  onChange={(e) => setAppFile(e.target.files?.[0] || null)}
                  disabled={appFileUploading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={uploadAppFile}
                  disabled={appFileUploading || !appFile}
                >
                  {appFileUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {formData.apk_url && (
                <p className="text-xs text-muted-foreground break-all">
                  Current file: {formData.apk_url}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
                disabled={logoUploading}
                className="flex-1"
              />
              {logoUploading && <Loader2 className="w-5 h-5 animate-spin" />}
            </div>
            {formData.logo_url && (
              <div className="mt-3 p-4 bg-secondary/30 rounded-lg border border-secondary">
                <p className="text-sm text-muted-foreground mb-2">Logo Preview:</p>
                <img src={formData.logo_url} alt="Logo preview" className="w-24 h-24 object-cover rounded" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
            <Label htmlFor="is_featured">Featured App</Label>
          </div>
        </div>

        {/* Version JSON */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Version JSON</h2>
          <p className="text-sm text-muted-foreground">
            Public URL:{" "}
            {formData.slug ? (
              <a
                href={`/apps/${formData.slug}/version.json`}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                /apps/{formData.slug}/version.json
              </a>
            ) : (
              <span>/apps/&lt;slug&gt;/version.json</span>
            )}
          </p>
          <Textarea
            value={JSON.stringify(buildVersionPayload(), null, 2)}
            readOnly
            rows={8}
            className="font-mono text-xs"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={updateVersionJson}
              disabled={!formData.slug || versionJsonUploading}
            >
              {versionJsonUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update version.json"
              )}
            </Button>
            {formData.slug && (
              <Button type="button" variant="ghost" asChild>
                <a href={`/apps/${formData.slug}/version.json`} target="_blank" rel="noreferrer">
                  Open version.json
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Features</h2>
          
          <div className="flex gap-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm"
                >
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Instructions</h2>
          <Textarea
            value={formData.instructions}
            onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            placeholder="Installation and usage instructions..."
            rows={5}
          />
        </div>

        {/* Screenshots */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Screenshots</h2>
          
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadScreenshot(e.target.files[0])}
              disabled={screenshotUploading}
              className="flex-1"
            />
            {screenshotUploading && <Loader2 className="w-5 h-5 animate-spin" />}
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.image_url}
                    alt={img.alt_text || "Screenshot"}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link to="/rscraft/apps">Cancel</Link>
          </Button>
          <Button type="submit" className="glow-primary" disabled={saveMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save App"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default AdminAppForm;
