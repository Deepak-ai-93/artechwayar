'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { removePost } from '@/lib/actions';
import { FilePenLine, Trash2, Loader2 } from 'lucide-react';

export function PostActions({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removePost(postId);
      toast({
        title: 'Post Deleted',
        description: 'The post has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the post. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      // The dialog will close automatically on success due to revalidation.
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild variant="ghost" size="icon">
        <Link href={`/admin/edit/${postId}`}>
          <FilePenLine className="h-4 w-4" />
          <span className="sr-only">Edit Post</span>
        </Link>
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete Post</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
