export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  tags?: string[];
  category: string;
  createdAt: string;
  user_id: string;
};
