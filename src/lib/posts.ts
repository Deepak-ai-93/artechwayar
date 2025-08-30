import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from './auth';

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  author: string;
  tags?: string[];
  createdAt: string;
};

const fromSupabase = (post: any): Post => ({
  id: post.id.toString(),
  title: post.title,
  slug: post.slug,
  content: post.content,
  imageUrl: post.imageUrl,
  author: post.author,
  tags: post.tags,
  createdAt: post.created_at,
});

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -

export const getPosts = async (): Promise<Post[]> => {
  const supabase = createSupabaseServerClient(true);
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
  return posts.map(fromSupabase);
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return undefined;
  }
  if (!data) return undefined;
  return fromSupabase(data);
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  const supabase = createSupabaseServerClient(true);
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching post by id ${id}:`, error);
    return undefined;
  }
  if (!data) return undefined;
  return fromSupabase(data);
};

export const addPost = async (supabase: SupabaseClient, postData: Omit<Post, 'id' | 'slug' | 'createdAt'>): Promise<Post> => {
  const newPost = {
    ...postData,
    slug: slugify(postData.title),
  };

  const { data, error } = await supabase
    .from('posts')
    .insert(newPost)
    .select()
    .single();

  if (error) {
    console.error('Error adding post:', error);
    throw new Error('Failed to create post.');
  }

  return fromSupabase(data);
};

export const updatePost = async (supabase: SupabaseClient, id: string, postData: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | undefined> => {
  const updatedFields: { [key: string]: any } = { ...postData };
  if (postData.title) {
    updatedFields.slug = slugify(postData.title);
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updatedFields)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return undefined;
  }

  return fromSupabase(data);
};

export const deletePost = async (supabase: SupabaseClient, id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }
  return true;
};

export const uploadFile = async (supabase: SupabaseClient, file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('images').upload(fileName, file);

  if (error) {
    throw new Error(`Storage error: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
  return publicUrl;
};
