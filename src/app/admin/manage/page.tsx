import { getPosts } from '@/lib/posts';
import { PostsDataTable } from './posts-data-table';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';

export default async function ManagePostsPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const searchTerm = searchParams.q || '';
  const page = Number(searchParams.page) || 1;

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const { posts, totalPosts } = await getPosts(supabase, { searchTerm, page });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Manage Posts</h1>
        <p className="text-muted-foreground">
          Here you can edit or delete your existing blog posts.
        </p>
      </div>
      <PostsDataTable posts={posts} totalPosts={totalPosts} />
    </div>
  );
}
