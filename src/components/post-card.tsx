import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from './ui/badge';
import { stripMarkdown } from '@/lib/utils';
import { cn } from '@/lib/utils';

type PostCardProps = {
  post: Post;
  layout?: 'horizontal' | 'vertical';
};

export default function PostCard({ post, layout = 'vertical' }: PostCardProps) {
  const plainContent = stripMarkdown(post.content);

  if (layout === 'horizontal') {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 transition-all duration-300 ease-in-out hover:bg-card/70 p-4 sm:p-8 rounded-lg">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              data-ai-hint="blog image"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{post.category}</Badge>
              <span>&middot;</span>
              <time dateTime={post.createdAt}>{format(parseISO(post.createdAt), 'MMMM d, yyyy')}</time>
            </div>
            <h2 className="font-headline text-3xl font-bold leading-tight transition-colors duration-300 group-hover:text-primary mb-4">
              {post.title}
            </h2>
            <p className="mb-6 line-clamp-3 sm:line-clamp-4 text-base leading-relaxed text-foreground/80">
              {plainContent}
            </p>
            <div className="flex items-center font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
              Read more
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Vertical Layout
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <div className="flex flex-col h-full overflow-hidden rounded-lg transition-all duration-300 ease-in-out hover:bg-card/70 hover:shadow-xl p-4">
        <div className="relative h-56 w-full overflow-hidden rounded-md mb-4 shadow-md">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            data-ai-hint="blog image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col flex-grow p-2">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary">{post.category}</Badge>
              <span>&middot;</span>
              <time dateTime={post.createdAt}>{format(parseISO(post.createdAt), 'MMM d, yyyy')}</time>
            </div>
            <h2 className="font-headline text-xl font-bold leading-snug transition-colors duration-300 group-hover:text-primary mb-2 flex-grow">
              {post.title}
            </h2>
            <div className="flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Read more
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
        </div>
      </div>
    </Link>
  );
}
