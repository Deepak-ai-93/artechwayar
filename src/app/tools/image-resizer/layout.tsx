
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Resizer | Artechway',
  description: 'Easily resize your images online for free. Adjust the width and height of your JPG, PNG, and WEBP images in seconds. Fast, secure, and no software required.',
  keywords: ['Image Resizer', 'Resize Image', 'Photo Resizer', 'Online Resizer', 'Free Image Tool'],
};

export default function ImageResizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
