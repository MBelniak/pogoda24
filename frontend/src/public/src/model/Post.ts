import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc';

export default interface Post {
    id: number;
    postDate: Date;
    postType: PostType;
    title: string;
    description: string;
    imagesPublicIds: string[];
}

export interface PostDTO {
    id: number;
    postDate: string;
    postType: PostType;
    title: string;
    description: string;
    imagesPublicIds: string[];
    addedToTopBar?: boolean;
    dueDate?: string;
}

export function postDTOToPost(postDTO: PostDTO): Post {
    return {
        ...postDTO,
        postDate: zonedTimeToUtc(postDTO.postDate, 'Europe/Warsaw')
    };
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
