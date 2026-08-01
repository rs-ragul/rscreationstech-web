ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS cover_image_urls TEXT[];

UPDATE public.blog_posts
SET cover_image_urls = ARRAY[cover_image_url]
WHERE cover_image_url IS NOT NULL
  AND COALESCE(array_length(cover_image_urls, 1), 0) = 0;
