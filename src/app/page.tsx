import PostCard from '@/components/post-card';
import { getPosts, Post } from '@/lib/posts';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Lightbulb, Rocket } from 'lucide-react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

// Helper component for the Featured Post
const FeaturedPost = ({ post }: { post: Post }) => (
  <section className="mb-24 md:mb-32">
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out md:grid-cols-2 hover:shadow-xl bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col justify-center p-8 md:p-16">
          <div className="mb-4 text-sm font-semibold tracking-widest uppercase text-primary">
            Featured Post
          </div>
          <CardTitle className="mb-4 font-headline text-4xl leading-tight group-hover:text-primary md:text-5xl">
            {post.title}
          </CardTitle>
          <div className="mb-6 flex items-center gap-4 text-base text-muted-foreground">
            <Badge variant="secondary">{post.category}</Badge>
            <span>&middot;</span>
            <time dateTime={post.createdAt}>
              {format(parseISO(post.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          <p className="mb-8 text-lg leading-relaxed text-foreground/80">
            {post.content.substring(0, 150)}...
          </p>
          <div className="flex items-center text-lg font-semibold text-primary">
            Read more
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
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

const WhyArtechway = () => (
  <section className="mb-24 rounded-lg bg-muted/50 p-12 text-center md:mb-32">
    <h2 className="mb-4 font-headline text-4xl font-bold tracking-tight md:text-5xl">
      Why Artechway?
    </h2>
    <p className="mx-auto mb-12 max-w-3xl text-xl text-muted-foreground">
      We believe in the transformative power of AI and its intersection with
      creative design and cutting-edge technology. Artechway is your guide to
      this exciting new world.
    </p>
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      <div className="flex flex-col items-center">
        <div className="mb-6 rounded-full bg-primary/10 p-5">
          <BrainCircuit className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 font-headline text-2xl font-semibold">
          Expert AI Insights
        </h3>
        <p className="text-muted-foreground text-lg">
          Deep dives into the latest AI trends, tools, and techniques.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-6 rounded-full bg-primary/10 p-5">
          <Lightbulb className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 font-headline text-2xl font-semibold">
          Creative Inspiration
        </h3>
        <p className="text-muted-foreground text-lg">
          Exploring how AI is reshaping the boundaries of design and art.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-6 rounded-full bg-primary/10 p-5">
          <Rocket className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 font-headline text-2xl font-semibold">
          Future-Focused
        </h3>
        <p className="text-muted-foreground text-lg">
          Looking ahead at the technology that will define our tomorrow.
        </p>
      </div>
    </div>
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
  <section key={category.href} className="mb-24 md:mb-32">
    <div className="mb-10 flex items-center justify-between">
      <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Latest in <span className="text-primary">{category.label}</span>
      </h2>
      <Button asChild variant="link" className="text-lg text-primary hidden md:inline-flex">
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

const CallToAction = () => (
  <section className="mt-16 text-center">
    <h2 className="mb-4 font-headline text-4xl font-bold tracking-tight md:text-5xl">
      Join our Journey
    </h2>
    <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
      Stay up to date with the latest articles and resources. No spam, just
      quality content.
    </p>
  </section>
);


export default async function Home() {
  const allPosts = await getPosts();

  if (allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24">
         <div className="text-center">
          <h1 className="mb-4 text-center font-headline text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            Welcome to <span className="text-primary">Artechway</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto md:text-2xl">
            Exploring the frontiers of AI, design, and technology. Fresh ideas and perspectives, delivered weekly.
          </p>
        </div>
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-lg">No posts yet. The ink is still drying!</p>
          <p>An administrator can create new posts in the admin portal.</p>
        </div>
      </div>
    );
  }

  const featuredPost = allPosts[0];

  return (
    <div className="container mx-auto px-4 py-16 sm:py-24">
      <div className="mb-24 text-center md:mb-32">
        <h1 className="mb-4 font-headline text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
          Welcome to <span className="text-primary">Artechway</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground md:text-2xl">
          Exploring the frontiers of AI, design, and technology. Fresh ideas and
          perspectives, delivered weekly.
        </p>
      </div>

      <FeaturedPost post={featuredPost} />
      
      <WhyArtechway />

      {routes.map((route) => {
        const postsForCategory = allPosts
          .filter((post) => post.category === route.label)
          .slice(0, 3);
        
        if (postsForCategory.length === 0) {
          return null;
        }

        return (
          <CategorySection
            key={route.href}
            category={route}
            posts={postsForCategory}
          />
        );
      })}
      
      <CallToAction />
    </div>
  );
}
