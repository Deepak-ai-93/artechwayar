import { getPostBySlug, stripMarkdown } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

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
    description: stripMarkdown(post.content).substring(0, 150),
    keywords: post.tags,
  };
}

const markdownToHtml = async (markdown: string) => {
  const result = await unified().use(remarkParse).use(remarkHtml).process(markdown);
  return result.toString();
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(post.content);
  const plainContent = stripMarkdown(post.content);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://artechway.com/blog/${post.slug}`,
    },
    headline: post.title,
    image: post.image_url,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Artechway',
      logo: {
        '@type': 'ImageObject',
        url: 'https://artechway.com/artechway.png',
      },
    },
    description: plainContent.substring(0, 250),
  };

  return (
    <article className="container mx-auto max-w-4xl px-4 py-8 sm:py-16">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="mb-4 font-headline text-4xl font-bold tracking-tight md:text-6xl">
          {post.title}
        </h1>
        <p className="text-muted-foreground">
          Posted by {post.author} on {format(parseISO(post.createdAt), 'MMMM d, yyyy')}
        </p>
      </header>

      <div className="relative mb-12 h-64 w-full overflow-hidden rounded-lg shadow-lg md:h-[450px]">
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          priority
          className="object-cover"
          data-ai-hint="blog header"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div 
        className={cn(
          'prose prose-lg max-w-none text-foreground/90 dark:prose-invert', 
          'prose-headings:font-headline prose-headings:text-primary',
          'prose-a:text-primary hover:prose-a:text-primary/80',
          'prose-strong:font-semibold prose-strong:text-foreground'
        )}
        dangerouslySetInnerHTML={{ __html: contentHtml }} 
      />
    </article>
  );
}
