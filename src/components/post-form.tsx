'use client';

import { useState, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createPost, editPost, generateBlogTitle, generateBlogContent, uploadImage } from '@/lib/actions';
import type { Post } from '@/lib/posts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export default function PostForm({ post }: { post?: Post & {tags?: string} }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!post;
  const formAction = isEdit ? editPost.bind(null, post.id) : createPost;
  const [state, action] = useActionState(formAction, { message: '' });

  const [keywords, setKeywords] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const [generatedTitle, setGeneratedTitle] = useState(post?.title || '');
  const [generatedContent, setGeneratedContent] = useState(post?.content || '');
  
  const [titleError, setTitleError] = useState('');

  const [imageUrl, setImageUrl] = useState(post?.imageUrl || 'https://picsum.photos/1200/800');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleGenerateTitle = async () => {
    if (!keywords) {
        setTitleError('Please enter keywords to generate a title.');
        return;
    }
    setTitleError('');
    setIsGeneratingTitle(true);
    const result = await generateBlogTitle(keywords);
    if (result.title) {
        setGeneratedTitle(result.title);
    } else {
        setTitleError(result.error || 'An unknown error occurred.');
    }
    setIsGeneratingTitle(false);
  };

  const handleGenerateContent = async () => {
    if (!generatedTitle) {
      toast({
        variant: 'destructive',
        title: 'Title is missing',
        description: 'Please generate or enter a title first to generate content.',
      });
      return;
    }
    setIsGeneratingContent(true);
    const result = await generateBlogContent(generatedTitle);
    if (result.content) {
      setGeneratedContent(result.content);
    } else {
      toast({
        variant: 'destructive',
        title: 'Content Generation Failed',
        description: result.error || 'An unknown error occurred while generating content.',
      });
    }
    setIsGeneratingContent(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const result = await uploadImage(formData);
      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        toast({
          title: 'Image Uploaded',
          description: 'Your image has been successfully uploaded.',
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message || 'Failed to upload image. Please try again.',
      });
    } finally {
      setIsUploading(false);
    }
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
                disabled={isGeneratingTitle}
              />
              <Button type="button" onClick={handleGenerateTitle} disabled={isGeneratingTitle} className="w-full sm:w-auto">
                {isGeneratingTitle ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                <span>{isGeneratingTitle ? 'Generating...' : 'Generate Title'}</span>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <Button type="button" variant="secondary" size="sm" onClick={handleGenerateContent} disabled={isGeneratingContent}>
                {isGeneratingContent ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                <span>{isGeneratingContent ? 'Generating...' : 'Generate with AI'}</span>
              </Button>
            </div>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your blog post here..."
              required
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              rows={15}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g., react, tailwind, nextjs"
              defaultValue={post?.tags}
            />
            <p className="text-sm text-muted-foreground">
              Separate tags with commas.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
               <Input id="imageUrl" name="imageUrl" type="hidden" value={imageUrl} />
               <img src={imageUrl} alt="Post image" className="h-20 w-20 rounded-md object-cover" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  {isUploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                </Button>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload an image for your post. The current image URL will be used if no new image is uploaded.
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
