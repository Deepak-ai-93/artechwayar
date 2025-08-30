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
});

export async function createPost(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { message: 'Unauthorized' };
  }

  try {
    const parsed = postSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      imageUrl: formData.get('imageUrl'),
      tags: formData.get('tags'),
    });

    const tagsArray = parsed.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    await addPost({
      title: parsed.title,
      content: parsed.content,
      imageUrl: parsed.imageUrl,
      tags: tagsArray,
      author: session.user.email || 'Admin',
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { message: 'Invalid form data. Please check your inputs.' };
    }
    console.error(e);
    return { message: 'An error occurred while creating the post.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/manage');
  redirect('/admin/manage');
}

export async function editPost(id: string, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { message: 'Unauthorized' };
  }

  try {
    const parsed = postSchema.parse({
      title: formData.get('title'),
      content: formData.get('content'),
      imageUrl: formData.get('imageUrl'),
      tags: formData.get('tags'),
    });
    
    const tagsArray = parsed.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    await updatePost(id, {
      title: parsed.title,
      content: parsed.content,
      imageUrl: parsed.imageUrl,
      tags: tagsArray,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { message: 'Invalid form data. Please check your inputs.' };
    }
    console.error(e);
    return { message: 'An error occurred while updating the post.' };
  }

  revalidatePath('/');
  revalidatePath(`/blog/[slug]`, 'page');
  revalidatePath('/admin/manage');
  revalidatePath(`/admin/edit/${id}`);
  redirect('/admin/manage');
}

export async function removePost(id: string) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  const success = await deletePost(id);
  if (success) {
    revalidatePath('/');
    revalidatePath('/admin/manage');
  } else {
    throw new Error('Failed to delete post');
  }
}

export async function generateBlogTitle(keywords: string) {
  const session = await getSession();
  if (!session) {
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
  const session = await getSession();
  if (!session) {
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
  const session = await getSession();
  if (!session) {
    return { error: 'Unauthorized' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { error: 'No file provided.' };
  }
  
  try {
    const imageUrl = await uploadFile(file);
    return { imageUrl };
  } catch (error: any) {
    return { error: error.message };
  }
}
