-- Storage bucket and RLS policies for app assets
-- Ensures admin uploads (logos, screenshots, downloads, version.json) work

-- Create bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('app-assets', 'app-assets', true)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public;

-- Public read access for app assets
DROP POLICY IF EXISTS "Public read access for app assets" ON storage.objects;
CREATE POLICY "Public read access for app assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'app-assets');

-- Authenticated users can upload app assets
DROP POLICY IF EXISTS "Authenticated users can upload app assets" ON storage.objects;
CREATE POLICY "Authenticated users can upload app assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'app-assets' AND auth.uid() IS NOT NULL);

-- Authenticated users can update app assets (needed for upsert)
DROP POLICY IF EXISTS "Authenticated users can update app assets" ON storage.objects;
CREATE POLICY "Authenticated users can update app assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'app-assets' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'app-assets' AND auth.uid() IS NOT NULL);

-- Authenticated users can delete app assets
DROP POLICY IF EXISTS "Authenticated users can delete app assets" ON storage.objects;
CREATE POLICY "Authenticated users can delete app assets"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'app-assets' AND auth.uid() IS NOT NULL);
