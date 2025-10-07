
import PostCard from '@/components/post-card';
import { getPosts } from '@/lib/posts';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';
import AnimatedHeroText from '@/components/animated-hero-text';
import { FloatingIcons } from '@/components/floating-icons';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const { posts: allPosts } = await getPosts(supabase, { page: 1, limit: 10 });

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

  const topStory = allPosts[0];
  const secondaryStories = allPosts.slice(1, 5);
  const otherPosts = allPosts.slice(5);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Main Story */}
            <div className="lg:col-span-2">
                <h2 className="font-headline text-2xl font-bold tracking-tight mb-4 border-b pb-2 border-border">Top Story</h2>
                {topStory && <PostCard post={topStory} layout="horizontal" />}
            </div>

            {/* Side Stories */}
            <div className="space-y-4">
                <h2 className="font-headline text-2xl font-bold tracking-tight mb-4 border-b pb-2 border-border">Latest</h2>
                {secondaryStories.map(post => (
                    <PostCard key={post.id} post={post} layout="vertical-minimal" />
                ))}
            </div>
        </div>

        {otherPosts.length > 0 && (
            <div>
                <h2 className="font-headline text-2xl font-bold tracking-tight mb-4 border-b pb-2 border-border">More Stories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherPosts.map(post => (
                        <PostCard key={post.id} post={post} layout="vertical" />
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}
