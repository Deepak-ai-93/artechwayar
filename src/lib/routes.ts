
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
      { href: '/tools/image-converter', label: 'Image Converter' },
    ],
  },
];
