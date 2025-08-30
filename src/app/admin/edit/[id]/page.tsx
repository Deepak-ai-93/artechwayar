import { getPostById } from '@/lib/posts';
import PostForm from '@/components/post-form';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }
  
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="text-muted-foreground">
          Refine and update your post. Every word counts.
        </p>
      </div>
      <PostForm post={{...post, slug: post.slug, tags: post.tags?.join(', ')}} />
    </div>
  );
}
