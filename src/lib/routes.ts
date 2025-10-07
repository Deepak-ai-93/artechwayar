
export type NavItem = {
  href: string;
  label: string;
};

export type DropdownItem = {
  label: string;
  isDropdown: true;
  items: NavItem[];
};

export type Route = NavItem | DropdownItem;

export const routes: Route[] = [
  { href: '/category/ai-design', label: 'AI Design' },
  { href: '/category/ai-marketing', label: 'AI Marketing' },
  { href: '/category/ai-news', label: 'AI News' },
  { href: '/category/future-of-ai', label: 'Future of AI' },
  { href: '/category/ai-for-business', label: 'AI for Business' },
  {
    label: 'Tools',
    isDropdown: true,
    items: [
      { href: '/tools/image-converter/png-to-jpg', label: 'PNG to JPG' },
      { href: '/tools/image-converter/webp-to-png', label: 'WEBP to PNG' },
      { href: '/tools/image-converter/webp-to-jpg', label: 'WEBP to JPG' },
      { href: '/tools/image-converter/heic-to-png', label: 'HEIC to PNG' },
      { href: '/tools/image-converter/heic-to-jpg', label: 'HEIC to JPG' },
      { href: '/tools/image-converter/jfif-to-png', label: 'JFIF to PNG' },
      { href: '/tools/picker-wheel', label: 'Picker Wheel' },
      { href: '/tools/image-resizer', label: 'Image Resizer' },
    ],
  },
];

export const isNavItem = (route: Route): route is NavItem => 'href' in route;
