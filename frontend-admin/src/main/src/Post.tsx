import * as fnstz from 'date-fns-tz';

export default interface Post {
    id: number;
    postDate: Date;
    postType: PostType;
    title: string,
    description: string;
    views: number;
    imagesPublicIdsJSON?: string[];
    addedToTopBar?: boolean;
    dueDate?: Date;
    shortDescription?: string;
}

export interface PostDTO {
    id: number;
    postDate: string;
    postType: PostType;
    title: string;
    description: string;
    views: number;
    imagesPublicIdsJSON?: string[];
    addedToTopBar?: boolean;
    dueDate?: string;
    shortDescription?: string;
}

export function postDTOToPost(postDTO: PostDTO): Post {
    console.log(postDTO);
    return {
        ...postDTO,
        postDate: fnstz.zonedTimeToUtc(postDTO.postDate, 'Europe/Warsaw'),
        dueDate: postDTO.dueDate ? fnstz.zonedTimeToUtc(postDTO.dueDate, 'Europe/Warsaw') : undefined
    };
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
