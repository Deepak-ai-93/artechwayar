
import PostCard from '@/components/post-card';
import { getPosts } from '@/lib/posts';
import { createSupabaseServerClient } from '@/lib/auth';
import { cookies } from 'next/headers';
import AnimatedHeroText from '@/components/animated-hero-text';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createSupabaseServerClient(cookieStore, true);
  const { posts: allPosts } = await getPosts(supabase, { page: 1, limit: 12 });

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
    </>
  );
}
