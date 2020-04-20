import * as fns from 'date-fns';
import config from './config/config';
const { BACKEND_DATE_FORMAT } = config;

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
        console.log(post.postDate);
        return {
            ...post,
            postDate: fns.parse(post.postDate, BACKEND_DATE_FORMAT, new Date()),
            dueDate: post.dueDate
                ? fns.parse(post.dueDate, BACKEND_DATE_FORMAT, new Date())
                : undefined
        };
    });
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
