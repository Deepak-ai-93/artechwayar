import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from './auth';

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  tags?: string[];
  category: string;
  createdAt: string;
  user_id: string;
};

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

export const stripMarkdown = (markdown: string) => {
  return markdown
    // Remove headings
    .replace(/#{1,6}\s+(.*)/g, '$1')
    // Remove bold and italics
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^\s*([-*_]){3,}\s*$/gm, '')
    // Remove lists
    .replace(/^\s*[\d*+-]+\.\s+/gm, '')
    // Replace extra newlines
    .replace(/\n{2,}/g, '\n')
    .trim();
};


export const getPosts = async (): Promise<Post[]> => {
  const supabase = createSupabaseServerClient(true);
  if (!supabase) {
    return [];
  }
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

export const getPostsByCategory = async (categoryLabel: string): Promise<Post[]> => {
  const supabase = createSupabaseServerClient(true);
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

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  const supabase = createSupabaseServerClient(true);
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

export const getPostById = async (id: string): Promise<Post | undefined> => {
  const supabase = createSupabaseServerClient(true);
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
    // Re-throw the original error to be caught by the server action
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
