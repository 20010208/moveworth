export type StudyBlogPost = {
  slug: string;
  category: string;
  date: string;
  reading_time: number;
  title: { ja: string; en: string };
  description: { ja: string; en: string };
  content: { ja: string; en: string };
};
