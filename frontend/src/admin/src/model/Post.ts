import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

export default interface Post {
    id: string;
    postDate: Date;
    postType: PostType;
    title: string,
    description: string;
    views: number;
    imagesPublicIds?: string[];
    dueDate?: Date;
    shortDescription?: string;
}

export interface PostDTO {
    id: string;
    postDate: string;
    postType: PostType;
    title: string;
    description: string;
    views: number;
    imagesPublicIds?: string[];
    dueDate: string;
    shortDescription: string;
}

export function postDTOToPost(postDTO: PostDTO): Post {
    return {
        ...postDTO,
        postDate: zonedTimeToUtc(postDTO.postDate, 'Europe/Warsaw'),
        dueDate: postDTO.dueDate ? zonedTimeToUtc(postDTO.dueDate, 'Europe/Warsaw') : undefined
    };
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
