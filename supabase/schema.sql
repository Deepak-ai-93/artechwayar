-- Create the 'posts' table
CREATE TABLE posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[]
);

-- Create a policy to enable read access for everyone
CREATE POLICY "Enable read access for all users"
ON storage.objects
FOR SELECT
USING ( bucket_id = 'images' );

-- Create the 'images' storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'images' );

-- Create a policy to allow authenticated users to update their own images
CREATE POLICY "Allow authenticated users to update own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING ( auth.uid() = owner );

-- Create a policy to allow authenticated users to delete their own images
CREATE POLICY "Allow authenticated users to delete own images"
ON storage.objects
FOR DELETE
TO authenticated
USING ( auth.uid() = owner );

-- Enable Row-Level Security (RLS) for the 'posts' table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all posts
CREATE POLICY "Allow public read access"
ON posts
FOR SELECT
USING (true);

-- Allow authenticated users to insert posts
CREATE POLICY "Allow authenticated users to insert"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update posts
CREATE POLICY "Allow authenticated users to update"
ON posts
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users to delete posts
CREATE POLICY "Allow authenticated users to delete"
ON posts
FOR DELETE
TO authenticated
USING (true);
