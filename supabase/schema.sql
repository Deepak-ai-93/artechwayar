-- Create the posts table
CREATE TABLE IF NOT EXISTS posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  "imageUrl" TEXT,
  author TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for the posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to read all posts
CREATE POLICY "Allow read access to all users" ON posts
  FOR SELECT
  USING (true);

-- Create a policy that allows users to insert their own posts
CREATE POLICY "Allow authenticated users to insert their own posts" ON posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own posts
CREATE POLICY "Allow authenticated users to update their own posts" ON posts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to delete their own posts
CREATE POLICY "Allow authenticated users to delete their own posts" ON posts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a storage bucket for images with public read access
INSERT INTO storage.buckets (id, name, public)
  VALUES ('images', 'images', TRUE)
  ON CONFLICT (id)
  DO NOTHING;

-- Create a policy that allows users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Create a policy that allows users to read images
CREATE POLICY "Allow all users to view images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

-- Create a policy that allows users to update their own images
CREATE POLICY "Allow authenticated users to update their own images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner)
  WITH CHECK (bucket_id = 'images');

-- Create a policy that allows users to delete their own images
CREATE POLICY "Allow authenticated users to delete their own images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner);
