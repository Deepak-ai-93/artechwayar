'use server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Post } from '@/lib/types';
import { POSTS_PER_PAGE } from './utils';

const fromSupabase = (post: any): Post => ({
  id: post.id.toString(),
  title: post.title,
  slug: post.slug,
  content: post.content,
  image_url: post.image_url,
  author: post.author,
  tags: post.tags,
  category: post.category,
  createdAt: post.created_at,
  user_id: post.user_id,
});

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -

type GetPostsArgs = {
  searchTerm?: string;
  page?: number;
};

export const getPosts = async (supabase: SupabaseClient | null, args: GetPostsArgs = {}): Promise<{ posts: Post[]; totalPosts: number }> => {
  const { searchTerm = '', page = 1 } = args;
  
  if (!supabase) {
    return { posts: [], totalPosts: 0 };
  }

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' });

  if (searchTerm) {
    query = query.ilike('title', `%${searchTerm}%`);
  }
  
  query = query.range(from, to).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  
  if (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], totalPosts: 0 };
  }

  return { 
    posts: data.map(fromSupabase), 
    totalPosts: count || 0 
  };
};

export const getPostsByCategory = async (supabase: SupabaseClient | null, categoryLabel: string): Promise<Post[]> => {
  if (!supabase) {
    return [];
  }
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', categoryLabel)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching posts for category ${categoryLabel}:`, error);
    return [];
  }
  return posts.map(fromSupabase);
};

export const getPostBySlug = async (supabase: SupabaseClient | null, slug: string): Promise<Post | undefined> => {
  if (!supabase) {
    return undefined;
  }
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

export const getPostById = async (supabase: SupabaseClient | null, id: string): Promise<Post | undefined> => {
  if (!supabase) {
    return undefined;
  }
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
    console.error('Error adding post to database:', error);
    throw error;
  }

  return fromSupabase(data);
};

export const updatePost = async (supabase: SupabaseClient, id: string, postData: Partial<Omit<Post, 'id' | 'createdAt' | 'user_id'>>): Promise<Post | undefined> => {
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
