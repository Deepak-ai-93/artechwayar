
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Image Cropper | Artechway',
  description: 'Easily crop your images online for free. Crop JPG, PNG, and WEBP images to the exact dimensions you need. Fast, secure, and right in your browser.',
  keywords: ['Image Cropper', 'Crop Image', 'Photo Cropper', 'Online Cropper', 'Free Image Tool', 'Crop JPG', 'Crop PNG'],
};

export default function ImageCropperLayout({ children }: { children: React.ReactNode }) {
  return children;
}
