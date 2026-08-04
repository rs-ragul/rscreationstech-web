ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS image_urls TEXT[];

UPDATE public.projects
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND COALESCE(array_length(image_urls, 1), 0) = 0;

SELECT pg_notify('pgrst', 'reload schema');