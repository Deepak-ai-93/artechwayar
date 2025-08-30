'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createPost, editPost, generateBlogTitle } from '@/lib/actions';
import type { Post } from '@/lib/posts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Save } from 'lucide-react';

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      <span>{pending ? (isEdit ? 'Saving...' : 'Publishing...') : (isEdit ? 'Save Changes' : 'Publish Post')}</span>
    </Button>
  );
}

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;
  const formAction = isEdit ? editPost.bind(null, post.id) : createPost;
  const [state, action] = useActionState(formAction, { message: '' });

  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState(post?.title || '');
  const [titleError, setTitleError] = useState('');

  const handleGenerateTitle = async () => {
    if (!keywords) {
        setTitleError('Please enter keywords to generate a title.');
        return;
    }
    setTitleError('');
    setIsGenerating(true);
    const result = await generateBlogTitle(keywords);
    if (result.title) {
        setGeneratedTitle(result.title);
    } else {
        setTitleError(result.error || 'An unknown error occurred.');
    }
    setIsGenerating(false);
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{isEdit ? 'Edit Post' : 'Create a New Post'}</CardTitle>
        <CardDescription>
          {isEdit ? 'Make changes to your existing post.' : 'Fill in the details to publish a new blog post.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="keywords">AI Title Generation</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="keywords"
                placeholder="e.g., 'React hooks', 'web performance'"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                disabled={isGenerating}
              />
              <Button type="button" onClick={handleGenerateTitle} disabled={isGenerating} className="w-full sm:w-auto">
                {isGenerating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                <span>{isGenerating ? 'Generating...' : 'Generate Title'}</span>
              </Button>
            </div>
            {titleError && <p className="text-sm font-medium text-destructive">{titleError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Your post title"
              required
              value={generatedTitle}
              onChange={(e) => setGeneratedTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your blog post here..."
              required
              defaultValue={post?.content}
              rows={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              placeholder="https://picsum.photos/1200/800"
              required
              defaultValue={post?.imageUrl || 'https://picsum.photos/1200/800'}
            />
             <p className="text-sm text-muted-foreground">
                Use a service like <a href="https://picsum.photos/" target="_blank" rel="noopener noreferrer" className="underline">picsum.photos</a> for placeholder images.
            </p>
          </div>
          
          {state?.message && (
            <p className="text-sm font-medium text-destructive">{state.message}</p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
              Cancel
            </Button>
            <SubmitButton isEdit={isEdit} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
