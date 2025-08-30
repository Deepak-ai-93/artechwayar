import PostCard from '@/components/post-card';
import { getPosts } from '@/lib/posts';

export default async function Home() {
  const posts = await getPosts();

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
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No posts yet. The ink is still drying!</p>
          <p>An administrator can create new posts in the admin portal.</p>
        </div>
      )}
    </div>
  );
}
