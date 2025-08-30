import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 150),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="text-muted-foreground">
          Posted by {post.author} on {format(parseISO(post.createdAt), 'MMMM d, yyyy')}
        </p>
      </header>

      <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-96">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          priority
          className="object-cover"
          data-ai-hint="blog header"
        />
      </div>

      <div className="prose prose-lg max-w-none text-foreground/90 prose-headings:font-headline prose-headings:text-foreground">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
