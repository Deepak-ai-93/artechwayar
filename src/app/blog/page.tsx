import { getPosts } from '@/lib/posts';
import PostCard from '@/components/post-card';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import Pagination from '@/components/pagination';
import { POSTS_PER_PAGE } from '@/lib/utils';

export const metadata: Metadata = {
    title: 'Blog | Artechway',
    description: 'Explore the latest articles and insights on AI, design, and technology. Stay up-to-date with our weekly posts.',
};

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const page = Number(searchParams.page) || 1;

  const { posts, totalPosts } = await getPosts(supabase, { page, limit: POSTS_PER_PAGE });

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          From the Blog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore the latest articles and insights on AI, design, and technology.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id}>
              <PostCard post={post} layout="vertical" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No posts found.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
