import React from 'react';
import {PostType} from "../../model/Post";
import {ForecastMapList} from "../components/ForecastMapList";
import {Divider} from "@shared/components/Divider";

export interface PostProps {
    postType: PostType;
    postDate: Date;
    title: string;
    description: string;
    imagesPublicIds: string[];
}

export const Post = (props: PostProps) => {

    const processDate = (postDate: Date) => {
        const date = postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    const processDescriptionForFact = (description: string) => {
        return (
            <div
                dangerouslySetInnerHTML={{
                    __html: description.replace(/\\"/g, '"')
                }}
            />
        );
    }

    const processDescription = (description: string) => {
        return description.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
    }

    return <div className="post">
        <div className="postdate fontSizeSmall">{processDate(props.postDate)}</div>
        <br/>
        <div className="postTitle fontSizeLarge">
            <span style={{wordWrap: 'break-word'}}>{props.title}</span>
        </div>
        <div className="postDescription fontSizeSmall">
            {props.postType === PostType.FACT ? (
                processDescriptionForFact(props.description)
            ) : (
                <span
                    dangerouslySetInnerHTML={{
                        __html: processDescription(props.description)
                    }}
                    style={{
                        wordWrap: 'break-word'
                    }}
                />
            )}
        </div>
        {props.postType !== PostType.FACT && props.imagesPublicIds.length > 0 ? (
            <>
                <Divider />
                <div style={{textAlign: 'center'}}>
                    <ForecastMapList imagesPublicIds={props.imagesPublicIds}/>
                </div>
            </>
        ) : null}
    </div>
}