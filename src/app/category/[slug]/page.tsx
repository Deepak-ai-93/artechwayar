
import { getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/post-card';
import { notFound } from 'next/navigation';
import { routes, isNavItem } from '@/lib/routes';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoryRoutes = routes.filter(isNavItem);
  const route = categoryRoutes.find(r => r.href === `/category/${params.slug}`);

  if (!route) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${route.label} Articles | Artechway`,
    description: `Browse the latest articles and insights on ${route.label}. Explore topics in AI, design, and technology.`,
  };
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryRoutes = routes.filter(isNavItem);
  const route = categoryRoutes.find(r => r.href === `/category/${params.slug}`);

  if (!route) {
    notFound();
  }

  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const posts = await getPostsByCategory(supabase, route.label);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Category: <span className="text-primary">{route.label}</span>
        </h1>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <div key={post.id} className="lg:col-span-1">
                    <PostCard post={post} layout="vertical" />
                </div>
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
  const categoryRoutes = routes.filter(isNavItem);
  return categoryRoutes.map(route => ({
    slug: route.href.replace('/category/', ''),
  }));
}
