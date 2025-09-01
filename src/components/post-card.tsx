import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from './ui/badge';
import { stripMarkdown } from '@/lib/posts';

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  const plainContent = stripMarkdown(post.content);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 bg-card/50 backdrop-blur-sm border border-primary/10 hover:border-primary/30">
        <CardHeader className="p-0">
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
              data-ai-hint="blog image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6 pb-2">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{post.category}</Badge>
              <span>&middot;</span>
              <time dateTime={post.createdAt}>{format(parseISO(post.createdAt), 'MMMM d, yyyy')}</time>
            </div>
            <CardTitle className="font-headline text-2xl leading-tight transition-colors duration-300 group-hover:text-primary">
              {post.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <p className="mb-4 line-clamp-3 text-base leading-relaxed text-foreground/80">
            {plainContent}
          </p>
          <div className="flex items-center font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Read more
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
