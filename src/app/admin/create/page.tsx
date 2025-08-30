import PostForm from '@/components/post-form';

export default function CreatePostPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">
          Bring your new ideas to life. Use the AI generator for a catchy title!
        </p>
      </div>
      <PostForm />
    </div>
  );
}
