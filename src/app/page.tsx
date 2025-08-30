import PostCard from '@/components/post-card';
import { getPosts } from '@/lib/posts';

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center font-headline text-5xl font-bold tracking-tight md:text-6xl">
        From the Inkwell
      </h1>
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
