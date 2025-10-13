
import PostCard from '@/components/post-card';
import { getPosts } from '@/lib/posts';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';
import AnimatedHeroText from '@/components/animated-hero-text';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const seoKeywords = [
  { label: 'AI Design', href: '/category/ai-design' },
  { label: 'AI Marketing', href: '/category/ai-marketing' },
  { label: 'Future of AI', href: '/category/future-of-ai' },
  { label: 'AI for Business', href: '/category/ai-for-business' },
  { label: 'Prompt Engineering', href: '/category/ai-design' },
  { label: 'Autonomous Agents', href: '/category/ai-for-business' },
  { label: 'Machine Learning', href: '/category/ai-news' },
  { label: 'Next.js Auth', href: '/category/ai-for-business' },
];

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const { posts: allPosts, totalPosts } = await getPosts(supabase, { page: 1, limit: 12 });

  if (allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="relative text-center">
            <h1 className="font-headline text-6xl font-bold tracking-tight md:text-8xl lg:text-9xl">
              Welcome to Artechway
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
  
  const mainPosts = allPosts.slice(0, 8);
  const recentPosts = allPosts.slice(0, 5);


  return (
    <>
      <div className="container mx-auto px-4 pt-16 sm:pt-24 text-center">
        <AnimatedHeroText />
        <p className="mt-4 mx-auto max-w-3xl text-lg md:text-xl text-muted-foreground">
          Dive into the future with Artechway. We explore the frontiers of AI, design, and technology with fresh ideas, in-depth articles, and expert perspectives delivered weekly.
        </p>
      </div>
      <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-2">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {mainPosts.map(post => (
                          <PostCard key={post.id} post={post} layout="vertical" />
                      ))}
                  </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-8">
                  <div>
                      <h2 className="font-headline text-2xl font-bold tracking-tight mb-4 border-b pb-2 border-border">Latest Posts</h2>
                      <div className="space-y-4">
                          {recentPosts.map(post => (
                              <PostCard key={post.id} post={post} layout="vertical-minimal" />
                          ))}
                      </div>
                  </div>
              </aside>
          </div>
      </div>

       {/* SEO Keyword Section */}
       <div className="container mx-auto px-4 pb-16">
          <div className="border-t pt-8">
            <h2 className="font-headline text-2xl font-bold tracking-tight mb-4 text-center">Explore Popular Topics</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {seoKeywords.map((keyword) => (
                <Link href={keyword.href} key={keyword.label}>
                  <Badge variant="secondary" className="text-sm px-3 py-1 hover:bg-primary/10 hover:text-primary transition-colors">
                    {keyword.label}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
       </div>
       
      {/* Purpose Section */}
      <div className="bg-muted/30">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight mb-4">
            Your Gateway to the Future of AI and Technology
          </h2>
          <div className="max-w-4xl mx-auto text-muted-foreground space-y-4">
            <p>
              Artechway is your premier destination for insightful articles, in-depth guides, and practical tools exploring the intersection of artificial intelligence, design, and technology. Our mission is to demystify complex topics and empower you with the knowledge to thrive in an AI-driven world.
            </p>
            <p>
              Whether you are interested in <Link href="/category/ai-for-business" className="text-primary hover:underline">AI for Business</Link>, mastering <Link href="/category/ai-design" className="text-primary hover:underline">Prompt Engineering</Link>, understanding the latest trends in <Link href="/category/ai-marketing" className="text-primary hover:underline">AI Marketing</Link>, or exploring the future of autonomous agents, we provide content that is both educational and actionable. Our free tools, like the Image Resizer and Picker Wheel, are designed to streamline your workflow and enhance your creative projects.
            </p>
            <p>
              Join us as we navigate the exciting frontiers of technology and discover how AI is reshaping our world.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
