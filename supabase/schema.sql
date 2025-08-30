-- Clean up existing resources
DELETE FROM storage.objects WHERE bucket_id = 'images';
DROP BUCKET IF EXISTS "images" CASCADE;
DROP TABLE IF EXISTS "posts";

-- Create the posts table
CREATE TABLE "posts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID REFERENCES auth.users(id) NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "content" TEXT NOT NULL,
  "imageUrl" TEXT,
  "author" TEXT,
  "tags" TEXT[],
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for the posts table
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies to ensure script is re-runnable
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

DROP POLICY IF EXISTS "Enable public read access for all posts" ON public.posts;
DROP POLICY IF EXISTS "Enable users to create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Enable users to update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Enable users to delete their own posts" ON public.posts;


-- Policies for storage.objects (images)
CREATE POLICY "Allow public read access to images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'images' );

CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' AND auth.uid() = owner );

CREATE POLICY "Allow users to update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner );

CREATE POLICY "Allow users to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner );

-- Policies for public.posts
CREATE POLICY "Enable public read access for all posts"
ON public.posts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Enable users to create their own posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable users to update their own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable users to delete their own posts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
