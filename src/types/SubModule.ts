export interface LearningResource {
    label: string;
    url: string;
}

export interface SelfLearning {
    explanation: string;
    url: string;
}

export interface SubModule {
    id: number;
    module_id: number;
    title: string;
    slug: string;
    description: string;
    duration_minutes: number;
    objectives: string;
    requirements: string;
    learning_resources: LearningResource[];
    self_learning: SelfLearning[];
    order: number;
    created_at: string;
    sub_module_materials: string;
    youtube_url: string;
    module_title?: string;
}

export type NewSubModule = Omit<SubModule, 'id' | 'created_at'>;

export type UpdateSubModule = Partial<Omit<SubModule, 'id' | 'created_at'>> & {
    id: number;
};
