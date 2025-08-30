-- Drop existing table and bucket to start fresh
DELETE FROM storage.objects WHERE bucket_id = 'images';
DELETE FROM storage.buckets WHERE id = 'images';
DROP TABLE IF EXISTS posts;

-- Create the posts table
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    "imageUrl" TEXT,
    author TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a bucket for images with public access
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) for the posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to posts"
ON posts
FOR SELECT
USING (TRUE);

CREATE POLICY "Allow authenticated users to create posts"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authors to update their own posts"
ON posts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authors to delete their own posts"
ON posts
FOR DELETE
USING (auth.uid() = user_id);

-- Set up RLS for the images storage bucket
CREATE POLICY "Allow public read access to images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

CREATE POLICY "Allow authenticated users to delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (auth.uid() = owner);
