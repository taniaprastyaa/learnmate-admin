export interface Module {
  id: number;
  category_id: number;
  slug: string;
  title: string;
  summary: string | null;
  learning_benefits: string | null;
  description: string | null;
  thumbnail: string | null;
  created_at: string;
  category_name?: string;
}

export type NewModule = Omit<Module, 'id' | 'created_at'>;

export type UpdateModule = Partial<Omit<Module, 'id' | 'created_at'>> & {
  id: number;
};
