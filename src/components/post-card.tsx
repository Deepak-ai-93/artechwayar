import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type PostCardProps = {
  post: Post;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            <Image
              src={post.image_url}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint="blog image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-6 pb-2">
            <CardTitle className="font-headline text-2xl leading-tight group-hover:text-primary">
              {post.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <p className="mb-4 text-sm text-muted-foreground">
            By {post.author} on {format(parseISO(post.createdAt), 'MMMM d, yyyy')}
          </p>
          <p className="mb-4 line-clamp-3 text-base leading-relaxed text-foreground/80">
            {post.content}
          </p>
          <div className="flex items-center font-semibold text-primary">
            Read more
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
