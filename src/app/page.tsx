import PostCard from '@/components/post-card';
import { getPosts, Post, stripMarkdown } from '@/lib/posts';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Code, Paintbrush } from 'lucide-react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedHeroText from '@/components/animated-hero-text';

const FeaturedPost = ({ post }: { post: Post }) => (
  <section className="mb-24 md:mb-32">
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="grid grid-cols-1 overflow-hidden transition-all duration-300 ease-in-out md:grid-cols-2 hover:shadow-2xl bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30">
        <div className="relative order-1 md:order-2 min-h-[300px] w-full md:min-h-0">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint="featured blog image"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <CardContent className="flex flex-col justify-center p-8 md:p-16 order-2 md:order-1">
          <div className="mb-4 text-sm font-semibold tracking-widest uppercase text-primary">
            Featured Post
          </div>
          <h2 className="mb-4 font-headline text-4xl md:text-5xl leading-tight text-primary-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <div className="mb-6 flex items-center gap-4 text-base text-muted-foreground">
            <Badge variant="outline">{post.category}</Badge>
            <span>&middot;</span>
            <time dateTime={post.createdAt}>
              {format(parseISO(post.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          <p className="mb-8 text-lg leading-relaxed text-foreground/80 line-clamp-3">
            {stripMarkdown(post.content)}
          </p>
          <div className="flex items-center text-lg font-semibold text-primary">
            Read more
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  </section>
);

const CategorySection = ({
  category,
  posts,
}: {
  category: { label: string; href: string };
  posts: Post[];
}) => (
  <section key={category.href} className="mb-24 md:mb-32">
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
    <div className="space-y-16">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} imageSide={index % 2 === 0 ? 'left' : 'right'} />
      ))}
    </div>
  </section>
);

const WhySection = () => (
    <section className="mb-24 text-center md:mb-32">
      <h2 className="mb-6 font-headline text-4xl font-bold tracking-tight md:text-5xl">
        Why <span className="text-primary">Artechway</span>?
      </h2>
      <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground md:text-xl">
        We are a collective of designers, developers, and AI enthusiasts passionate about exploring the intersection of technology and creativity.
      </p>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border-primary/10">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Bot className="h-10 w-10" />
          </div>
          <h3 className="mb-2 font-headline text-2xl font-bold">AI Innovation</h3>
          <p className="text-muted-foreground">
            Exploring the latest advancements and ethical considerations in artificial intelligence.
          </p>
        </Card>
        <Card className="flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border-primary/10">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <Paintbrush className="h-10 w-10" />
          </div>
          <h3 className="mb-2 font-headline text-2xl font-bold">Creative Design</h3>
          <p className="text-muted-foreground">
            Highlighting cutting-edge design trends and their fusion with new technologies.
          </p>
        </Card>
        <Card className="flex flex-col items-center p-8 bg-card/50 backdrop-blur-sm border-primary/10">
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

  const CallToAction = () => (
    <section className="rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/20 p-8 text-center border border-primary/20">
        <h2 className="mb-4 font-headline text-3xl font-bold md:text-4xl">
            Join our Journey
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
            Stay up to date with the latest articles, tutorials, and news from the world of AI and design.
        </p>
        <Button size="lg">
            <Link href="#">Subscribe Now</Link>
        </Button>
    </section>
);


export default async function Home() {
  const { posts: allPosts } = await getPosts();

  if (allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
            <h1 className="font-headline text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">
              Welcome to <AnimatedHeroText />
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-xl text-muted-foreground md:text-2xl">
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

  const dayOfMonth = new Date().getDate();
  const featuredPostIndex = dayOfMonth % allPosts.length;
  const featuredPost = allPosts[featuredPostIndex];
  
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 overflow-x-hidden">
      <div className="mb-24 text-center md:mb-32">
        <div className="relative mx-auto max-w-4xl">
           <h1 className="font-headline text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
            Welcome to <AnimatedHeroText />
          </h1>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-lg md:text-xl text-muted-foreground">
          Exploring the frontiers of AI, design, and technology. Fresh ideas and perspectives, delivered weekly.
        </p>
      </div>


      {featuredPost && <FeaturedPost post={featuredPost} />}

      {routes.map((route) => {
        const postsForCategory = allPosts
          .filter((post) => post.category === route.label);
        
        if (postsForCategory.length === 0) {
          return null;
        }

        return (
          <CategorySection
            key={route.href}
            category={route}
            posts={postsForCategory.slice(0,3)}
          />
        );
      })}

      <WhySection />
      <CallToAction />
    </div>
  );
}
