
import PostCard from '@/components/post-card';
import { getPosts } from '@/lib/posts';
import type { Post } from '@/lib/types';
import { routes, isNavItem } from '@/lib/routes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Code, Paintbrush } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AnimatedHeroText from '@/components/animated-hero-text';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';
import { cn } from '@/lib/utils';
import { FloatingIcons } from '@/components/floating-icons';

const CategorySection = ({
  category,
  posts,
}: {
  category: { label: string; href: string };
  posts: Post[];
}) => {
  if (posts.length === 0) return null;

  return (
    <section className="mb-24 md:mb-32">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Latest in <span className="text-primary">{category.label}</span>
        </h2>
        <Button asChild variant="link" className="text-lg text-primary hidden md:inline-flex">
          <Link href={category.href}>
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} layout="vertical" />
        ))}
      </div>
    </section>
  );
};

const WhySection = () => (
  <section className="mb-24 text-center md:mb-32">
    <h2 className="mb-6 font-headline text-4xl font-bold tracking-tight md:text-5xl">
      Why <span className="text-primary">Artechway</span>?
    </h2>
    <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground md:text-xl">
      We are a collective of designers, developers, and AI enthusiasts passionate about exploring the intersection of technology and creativity.
    </p>
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
      <Card className="flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border-secondary hover:border-primary/50 transition-colors duration-300">
        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
          <Bot className="h-10 w-10" />
        </div>
        <h3 className="mb-2 font-headline text-2xl font-bold">AI Innovation</h3>
        <p className="text-muted-foreground">
          Exploring the latest advancements and ethical considerations in artificial intelligence.
        </p>
      </Card>
      <Card className="flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border-secondary hover:border-primary/50 transition-colors duration-300">
        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
          <Paintbrush className="h-10 w-10" />
        </div>
        <h3 className="mb-2 font-headline text-2xl font-bold">Creative Design</h3>
        <p className="text-muted-foreground">
          Highlighting cutting-edge design trends and their fusion with new technologies.
        </p>
      </Card>
      <Card className="flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border-secondary hover:border-primary/50 transition-colors duration-300">
        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
          <Code className="h-10 w-10" />
        </div>
        <h3 className="mb-2 font-headline text-2xl font-bold">Tech Frontiers</h3>
        <p className="text-muted-foreground">
          Diving deep into the code and tools that are shaping the future of the web.
        </p>
      </Card>
    </div>
  </section>
);

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const { posts: allPosts } = await getPosts(supabase);

  if (allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="relative text-center">
            <FloatingIcons />
            <h1 className="font-headline text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">
              Welcome to <AnimatedHeroText />
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl">
              Exploring the frontiers of AI, design, and technology. Discover fresh ideas, perspectives, and useful tools.
            </p>
        </div>
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">No posts yet. The ink is still drying!</p>
          <p>An administrator can create new posts in the admin portal.</p>
        </div>
      </div>
    );
  }

  const featuredPosts = allPosts.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 overflow-x-hidden">
      <div className="mb-24 text-center md:mb-32 relative">
        <FloatingIcons />
        <div className="relative mx-auto max-w-4xl">
          <h1 className="font-headline text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            Welcome to <AnimatedHeroText />
          </h1>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-lg md:text-xl text-muted-foreground">
          Exploring the frontiers of AI, design, and technology. Discover fresh ideas, perspectives, and useful tools.
        </p>
      </div>

      <section className="mb-24 md:mb-32">
        <div className="mb-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
            Featured Articles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} layout="vertical" />
            ))}
        </div>
      </section>

      {routes.filter(isNavItem).map((route) => {
        const postsForCategory = allPosts
          .filter((post) => post.category === route.label);

        return (
          <CategorySection
            key={route.href}
            category={route}
            posts={postsForCategory.slice(0, 3)}
          />
        );
      })}

      <WhySection />
    </div>
  );
}
