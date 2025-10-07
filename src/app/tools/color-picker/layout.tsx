
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Color Picker | Artechway',
  description: 'Extract a color palette from any image. Upload your image and get the hex codes for the most prominent colors instantly. Perfect for designers and developers.',
  keywords: ['Color Picker', 'Image Color Extractor', 'Palette Generator', 'Hex Color Picker', 'Free Image Tool'],
};

export default function ColorPickerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
