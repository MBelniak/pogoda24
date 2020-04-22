import * as fns from 'date-fns';

export default interface Post {
    id: number;
    postDate: Date;
    postType: PostType;
    description: string;
    imagesPublicIdsJSON?: string[];
    addedToTopBar?: boolean;
    dueDate?: Date;
    shortDescription?: string;
}

export interface PostDTO {
    id: number;
    postDate: string;
    postType: PostType;
    description: string;
    imagesPublicIdsJSON?: string[];
    addedToTopBar?: boolean;
    dueDate?: string;
    shortDescription?: string;
}

export function postDTOsToPostsList(postDTOs: PostDTO[]): Post[] {
    return postDTOs.map(post => {
        return {
            ...post,
            postDate: fns.parseJSON(post.postDate),
            dueDate: post.dueDate ? fns.parseJSON(post.dueDate) : undefined
        };
    });
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
