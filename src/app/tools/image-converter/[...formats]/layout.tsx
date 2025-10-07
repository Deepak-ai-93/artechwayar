
import type { Metadata } from 'next';

const formatMetadata: Record<string, { title: string; description: string; keywords: string[] }> = {
    'png-to-jpg': {
      title: 'Free PNG to JPG Converter | Artechway',
      description: 'Easily convert your PNG images to high-quality JPG format for free. Fast, secure, and right in your browser.',
      keywords: ['PNG to JPG', 'Convert PNG to JPG', 'Image Converter', 'Free Converter'],
    },
    'webp-to-png': {
      title: 'Free WEBP to PNG Converter | Artechway',
      description: 'Convert modern WEBP images to the widely supported PNG format. Our online tool is fast, free, and preserves transparency.',
      keywords: ['WEBP to PNG', 'Convert WEBP to PNG', 'Image Converter', 'WEBP Converter'],
    },
    'webp-to-jpg': {
      title: 'Free WEBP to JPG Converter | Artechway',
      description: 'Quickly convert your WEBP files to standard JPG images. A simple and free online tool for all your conversion needs.',
      keywords: ['WEBP to JPG', 'Convert WEBP to JPG', 'Image Converter', 'WEBP to JPEG'],
    },
    'heic-to-png': {
      title: 'Free HEIC to PNG Converter | Artechway',
      description: 'Convert Apple\'s HEIC photos to standard PNG images online for free. No software needed, works on any device.',
      keywords: ['HEIC to PNG', 'Convert HEIC to PNG', 'HEIC Converter', 'iPhone Photo Converter'],
    },
    'heic-to-jpg': {
      title: 'Free HEIC to JPG Converter | Artechway',
      description: 'Easily convert your iPhone\'s HEIC photos to universal JPG format. Our free online tool is fast and easy to use.',
      keywords: ['HEIC to JPG', 'Convert HEIC to JPG', 'HEIC Converter', 'HEIF to JPG'],
    },
    'jfif-to-png': {
      title: 'Free JFIF to PNG Converter | Artechway',
      description: 'Convert JFIF images to PNG format seamlessly. Upload your file and get a high-quality PNG in seconds.',
      keywords: ['JFIF to PNG', 'Convert JFIF to PNG', 'JFIF Converter', 'Image Converter'],
    },
  };
  
type Props = {
  params: { formats: string[] };
};
  
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.formats?.[0] || '';
  const metadata = formatMetadata[slug];

  if (!metadata) {
    return {
      title: 'Image Converter | Artechway',
      description: 'A collection of free and easy-to-use online image converters.',
    };
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

export default function ImageConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
