import { getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/post-card';
import { notFound } from 'next/navigation';
import { routes } from '@/lib/routes';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const route = routes.find(r => r.href === `/category/${params.slug}`);

  if (!route) {
    notFound();
  }

  const posts = await getPostsByCategory(route.label);

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
        <div className="gap-8 space-y-8 md:columns-2 lg:columns-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
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
