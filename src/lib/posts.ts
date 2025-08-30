import 'server-only';

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
};

// In-memory store for blog posts
let posts: Post[] = [
  {
    id: '1',
    title: 'The Dawn of AI: A New Era of Creativity',
    slug: 'the-dawn-of-ai-a-new-era-of-creativity',
    content: 'Artificial Intelligence is no longer a concept of science fiction; it is a reality that is reshaping our world. This post explores the burgeoning role of AI in creative fields, from generating art and music to writing poetry and prose. We delve into the tools and techniques that are empowering this new wave of digital artistry and discuss the philosophical implications of creativity in the age of machines. Join us as we witness the dawn of a new era where human and artificial intelligence collaborate to push the boundaries of imagination.',
    imageUrl: 'https://picsum.photos/1200/800',
    author: 'Admin',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    title: 'Navigating the Digital Ocean: A Guide to Web Design',
    slug: 'navigating-the-digital-ocean-a-guide-to-web-design',
    content: 'The digital ocean is vast and ever-changing, but with the right map, you can navigate it with confidence. This guide provides a comprehensive overview of modern web design principles. We cover everything from user experience (UX) and user interface (UI) design to responsive layouts and accessibility standards. Whether you are a seasoned developer or just starting, this post will equip you with the knowledge to create websites that are not only beautiful but also functional and user-friendly. Set sail with us and master the art of navigating the digital seas.',
    imageUrl: 'https://picsum.photos/1200/801',
    author: 'Admin',
    createdAt: new Date('2023-10-28T14:30:00Z').toISOString(),
  },
  {
    id: '3',
    title: 'The Art of Simplicity in a Complex World',
    slug: 'the-art-of-simplicity-in-a-complex-world',
    content: 'In a world filled with noise and complexity, simplicity has become a rare and valuable commodity. This post explores the philosophy of minimalism and its application in design, technology, and everyday life. We examine how stripping away the non-essential can lead to greater clarity, focus, and beauty. From the clean lines of modern architecture to the intuitive interfaces of the best software, we celebrate the power of simplicity to create elegant and impactful experiences. Discover how embracing "less is more" can transform your work and your mindset.',
    imageUrl: 'https://picsum.photos/1200/802',
    author: 'Admin',
    createdAt: new Date('2023-11-02T09:00:00Z').toISOString(),
  },
];

const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -

export const getPosts = async (): Promise<Post[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.find(post => post.slug === slug);
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return posts.find(post => post.id === id);
};

export const addPost = async (postData: Omit<Post, 'id' | 'slug' | 'createdAt'>): Promise<Post> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const newPost: Post = {
    ...postData,
    id: Date.now().toString(),
    slug: slugify(postData.title),
    createdAt: new Date().toISOString(),
  };
  posts.push(newPost);
  return newPost;
};

export const updatePost = async (id: string, postData: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return undefined;
  }
  const originalPost = posts[postIndex];
  const updatedPost = {
    ...originalPost,
    ...postData,
    slug: postData.title ? slugify(postData.title) : originalPost.slug,
  };
  posts[postIndex] = updatedPost;
  return updatedPost;
};

export const deletePost = async (id: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const postIndex = posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return false;
  }
  posts.splice(postIndex, 1);
  return true;
};
