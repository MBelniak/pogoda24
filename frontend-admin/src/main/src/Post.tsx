import * as fnstz from 'date-fns-tz';

export default interface Post {
    id: number;
    postDate: Date;
    postType: PostType;
    title: string,
    description: string;
    views: number;
    imagesPublicIdsJSON?: string[];
}

export interface PostDTO {
    id: number;
    postDate: string;
    postType: PostType;
    title: string;
    description: string;
    views: number;
    imagesPublicIdsJSON?: string[];
}

export function postDTOToPost(postDTO: PostDTO): Post {
    return {
        ...postDTO,
        postDate: fnstz.zonedTimeToUtc(postDTO.postDate, 'Europe/Warsaw')
    };
}

export enum PostType {
    FORECAST = 'FORECAST',
    WARNING = 'WARNING',
    FACT = 'FACT'
}
