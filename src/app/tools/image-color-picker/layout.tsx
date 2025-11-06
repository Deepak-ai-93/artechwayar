
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Image Color Picker | Artechway',
  description: 'Instantly pick colors from any image with our free online tool. Get HEX, RGB, and HSL codes from your JPG, PNG, or WEBP files. Perfect for designers and developers.',
  keywords: ['Image Color Picker', 'Color Picker from Image', 'Get Color from Image', 'HEX Color Picker', 'Online Color Tool', 'Color Dropper'],
};

export default function ImageColorPickerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
