'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { addPost, deletePost, updatePost, uploadFile } from '@/lib/posts';
import { getSession, createSupabaseServerClient } from '@/lib/auth';
import { generateBlogTitle as generateTitleFlow } from '@/ai/flows/generate-blog-title';
import { generateBlogContent as generateContentFlow } from '@/ai/flows/generate-blog-content';

const loginSchema = z.object({
  username: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function login(prevState: any, formData: FormData) {
  const supabase = createSupabaseServerClient();
  try {
    const parsed = loginSchema.parse({
      username: formData.get('username'),
      password: formData.get('password'),
    });

    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.username,
      password: parsed.password,
    });

    if (error) {
      return { message: error.message };
    }
  } catch (e) {
    if (e instanceof z.ZodError) {
      let errorMessage = '';
      e.errors.forEach((err) => {
        errorMessage += err.message + '. ';
      });
      return { message: errorMessage.trim() };
    }
    return { message: 'An unknown error occurred' };
  }
  revalidatePath('/', 'layout');
  redirect('/admin');
}

export async function logout() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}

const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  imageUrl: z.string().url('Please enter a valid image URL'),
  tags: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
});

export async function createPost(prevState: any, formData: FormData) {
  const { user } = await getSession();
  if (!user) {
    return { message: 'Unauthorized: You must be logged in to create a post.' };
  }

  let parsed;
  try {
    parsed = postSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      imageUrl: formData.get('imageUrl'),
      tags: formData.get('tags'),
      category: formData.get('category'),
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      let errorMessage = '';
      e.errors.forEach((err) => {
        errorMessage += `${err.path[0]}: ${err.message}. `;
      });
      return { message: `Invalid data: ${errorMessage.trim()}` };
    }
    return { message: 'An unexpected error occurred during validation.' };
  }

  try {
    const supabase = createSupabaseServerClient();
    const tagsArray = parsed.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    await addPost(supabase, {
      title: parsed.title,
      content: parsed.content,
      imageUrl: parsed.imageUrl,
      tags: tagsArray,
      category: parsed.category,
      author: user.email || 'Admin',
      user_id: user.id,
    });
  } catch (error: any) {
    console.error('Database error in createPost:', error);
    // Return the full, detailed error message from the database.
    return { message: `An error occurred while creating the post: ${error.message}` };
  }

  revalidatePath('/', 'layout');
  redirect('/admin/manage');
}


export async function editPost(id: string, prevState: any, formData: FormData) {
  const { user } = await getSession();
  if (!user) {
    return { message: 'Unauthorized' };
  }
  
  const supabase = createSupabaseServerClient();

  try {
    const parsed = postSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      imageUrl: formData.get('imageUrl'),
      tags: formData.get('tags'),
      category: formData.get('category'),
    });
    
    const tagsArray = parsed.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    await updatePost(supabase, id, {
      title: parsed.title,
      content: parsed.content,
      imageUrl: parsed.imageUrl,
      tags: tagsArray,
      category: parsed.category,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { message: 'Invalid form data. Please check your inputs.' };
    }
    console.error(e);
    return { message: 'An error occurred while updating the post.' };
  }

  revalidatePath('/', 'layout');
  revalidatePath(`/blog/${formData.get('slug')}`, 'page');
  redirect('/admin/manage');
}

export async function removePost(id: string) {
  const { user } = await getSession();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const supabase = createSupabaseServerClient();
  const success = await deletePost(supabase, id);
  if (success) {
    revalidatePath('/');
    revalidatePath('/admin/manage');
  } else {
    throw new Error('Failed to delete post');
  }
}

export async function generateBlogTitle(keywords: string) {
  const { user } = await getSession();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  if (!keywords) {
    return { error: 'Keywords are required to generate a title.' };
  }
  try {
    const { title } = await generateTitleFlow({ keywords });
    return { title };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate title.' };
  }
}

export async function generateBlogContent(title: string) {
  const { user } = await getSession();
  if (!user) {
    return { error: 'Unauthorized' };
  }
  if (!title) {
    return { error: 'A title is required to generate content.' };
  }
  try {
    const { content } = await generateContentFlow({ title });
    return { content };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to generate content.' };
  }
}

export async function uploadImage(formData: FormData) {
  const { user } = await getSession();
  if (!user) {
    return { error: 'Unauthorized' };
  }

  const supabase = createSupabaseServerClient();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return { error: 'No file provided or invalid file format.' };
  }

  try {
    const imageUrl = await uploadFile(supabase, file);
    return { imageUrl };
  } catch (error: any) {
    console.error('Upload action error:', error);
    return { error: error.message || 'An unknown upload error occurred.' };
  }
}
