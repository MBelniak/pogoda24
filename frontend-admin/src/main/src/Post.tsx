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

export function postDTOToPost(postDTO: PostDTO): Post {
    return {
        ...postDTO,
        postDate: fns.parseJSON(postDTO.postDate),
        dueDate: postDTO.dueDate ? fns.parseJSON(postDTO.dueDate) : undefined
    };
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
