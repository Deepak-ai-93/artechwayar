import { getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/post-card';
import { notFound } from 'next/navigation';
import { routes } from '@/lib/routes';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const route = routes.find(r => r.href === `/category/${params.slug}`);

  if (!route) {
    notFound();
  }

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const posts = await getPostsByCategory(supabase, route.label);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="mb-4 text-center font-headline text-5xl font-bold tracking-tight md:text-7xl">
          Category: <span className="text-primary">{route.label}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Posts filed under the &quot;{route.label}&quot; category.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-16">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} imageSide={index % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No posts found in this category yet.</p>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return routes.map(route => ({
    slug: route.href.replace('/category/', ''),
  }));
}
