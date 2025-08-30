'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { addPost, deletePost, updatePost } from '@/lib/posts';
import { getSession, createSupabaseServerClient } from '@/lib/auth';
import { generateBlogTitle as generateTitleFlow } from '@/ai/flows/generate-blog-title';

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
    });

    await addPost({
      ...parsed,
      author: session.user.email || 'Admin',
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { message: 'Invalid form data. Please check your inputs.' };
    }
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
    });

    await updatePost(id, parsed);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return { message: 'Invalid form data. Please check your inputs.' };
    }
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
