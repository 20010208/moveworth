export type StudyBlogPost = {
  slug: string;
  category: string;
  date: string;
  reading_time: number;
  title: { ja: string; en: string; zh?: string };
  description: { ja: string; en: string; zh?: string };
  content: { ja: string; en: string; zh?: string };
  thumbnail?: string | null;
  thumbnail_ja?: string | null;
  thumbnail_en?: string | null;
  thumbnail_zh?: string | null;
};
