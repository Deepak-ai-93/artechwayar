import PostCard from '@/components/post-card';
import { getPosts, Post } from '@/lib/posts';
import { routes } from '@/components/main-nav';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

// Helper component for the Featured Post
const FeaturedPost = ({ post }: { post: Post }) => (
  <section className="mb-16">
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out md:grid-cols-2 hover:shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col justify-center p-8 md:p-12">
          <div className="mb-4 text-sm font-semibold tracking-widest uppercase text-primary">
            Featured Post
          </div>
          <CardTitle className="mb-4 font-headline text-4xl leading-tight group-hover:text-primary md:text-5xl">
            {post.title}
          </CardTitle>
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span>&middot;</span>
            <time dateTime={post.createdAt}>
              {format(parseISO(post.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          <p className="mb-8 text-base leading-relaxed text-foreground/80 md:text-lg">
            {post.content.substring(0, 150)}...
          </p>
          <div className="flex items-center font-semibold text-primary">
            Read more
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
        <div className="relative min-h-[300px] w-full md:min-h-0">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="featured blog image"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </Card>
    </Link>
  </section>
);

// Helper component for a Category Section
const CategorySection = ({
  category,
  posts,
}: {
  category: { label: string; href: string };
  posts: Post[];
}) => (
  <section key={category.href} className="mb-16">
    <div className="mb-8 flex items-center justify-between">
      <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
        {category.label}
      </h2>
      <Button asChild variant="link" className="text-primary">
        <Link href={category.href}>
          View all <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
    {posts.length > 0 ? (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    ) : (
      <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center text-muted-foreground">
        <p>No posts in this category yet. Stay tuned!</p>
      </div>
    )}
  </section>
);

export default async function Home() {
  const allPosts = await getPosts();

  if (allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
         <div className="text-center mb-16">
          <h1 className="mb-4 text-center font-headline text-5xl font-bold tracking-tight md:text-7xl">
            Welcome to <span className="text-primary">Artechway</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exploring the frontiers of AI, design, and technology. Fresh ideas and perspectives, delivered weekly.
          </p>
        </div>
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No posts yet. The ink is still drying!</p>
          <p>An administrator can create new posts in the admin portal.</p>
        </div>
      </div>
    );
  }

  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(1);
  
  const postsByCategory: { [key: string]: Post[] } = {};
  routes.forEach(route => {
    postsByCategory[route.label] = [];
  });
  otherPosts.forEach(post => {
    if (postsByCategory[post.category]) {
      postsByCategory[post.category].push(post);
    }
  });


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-center font-headline text-5xl font-bold tracking-tight md:text-7xl">
          Welcome to <span className="text-primary">Artechway</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Exploring the frontiers of AI, design, and technology. Fresh ideas and
          perspectives, delivered weekly.
        </p>
      </div>

      <FeaturedPost post={featuredPost} />

      {routes.map((route) => (
        <CategorySection
          key={route.href}
          category={route}
          posts={postsByCategory[route.label].slice(0, 3)} // Show max 3 posts per category
        />
      ))}
    </div>
  );
}
