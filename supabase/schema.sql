-- Clear existing data and policies
DELETE FROM storage.objects WHERE bucket_id = 'images';
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to images" ON storage.objects;
DELETE FROM storage.buckets WHERE id = 'images';

-- Drop existing table if it exists
DROP TABLE IF EXISTS posts;

-- Create the posts table
CREATE TABLE posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT,
    tags TEXT[],
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies for posts table
DROP POLICY IF EXISTS "Allow public read access to all posts" ON posts;
CREATE POLICY "Allow public read access to all posts"
    ON posts FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert their own posts" ON posts;
CREATE POLICY "Allow authenticated users to insert their own posts"
    ON posts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated users to update their own posts" ON posts;
CREATE POLICY "Allow authenticated users to update their own posts"
    ON posts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow authenticated users to delete their own posts" ON posts;
CREATE POLICY "Allow authenticated users to delete their own posts"
    ON posts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage.objects (images)
CREATE POLICY "Allow authenticated users to upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to images"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'images');

CREATE POLICY "Allow authenticated users to update their own images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1])
    WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow authenticated users to delete their own images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
