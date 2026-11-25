export interface MicroCMSContent {
    id: string;
    auth?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    revisedAt?: string;
    filePath?: string;
    storageFilePath?: string;
}

export interface News extends MicroCMSContent {
    title: string;
    content: string;
    category: string[];
    eyecatch?: {
        url: string;
        height?: number;
        width?: number;
    };
}

export interface Council extends MicroCMSContent {
    title: string;
    content: string;
    category: string[];
    eyecatch?: {
        url: string;
    };
}

export interface Board extends MicroCMSContent {
    title: string;
    content: string;
    category: string[];
    isPublicFile?: boolean;
    eyecatch?: {
        url: string;
    };
}
