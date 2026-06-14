export type MultiLang = {
  ja: string;
  en: string;
  zh?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  published_at: string;
  reading_minutes: number;
  thumbnail: string | null;
  title: MultiLang;
  description: MultiLang;
  content: MultiLang;
  locales: string[] | null;
  pinned: boolean;
  is_published: boolean;
  created_at: string;
};
