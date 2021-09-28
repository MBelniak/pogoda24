import React from 'react';
import Post, {PostType} from '../../model/Post';
import {Link} from 'react-router-dom';
import {ForecastMapList} from './ForecastMapList';
import {Image, Transformation} from 'cloudinary-react';
import config from '../../config/config';
import '../../sass/main.scss';
import 'suneditor/dist/css/suneditor.min.css';
import {Divider} from "@shared/components/Divider";

const {nonExpandedPostLength} = config;

interface PostsItemProps {
    post: Post;
    registerView: (id: number[]) => void;
}

export const PostsListItem: React.FC<PostsItemProps> = (props) => {

    const postHref = 'posts/' + props.post.id;

    const isExpandedByDefault = React.useMemo(() => {
        let description;
        if (props.post.postType === 'FACT') {
            return false;
        } else {
            description = props.post.description;
        }
        return description.length <= nonExpandedPostLength && description.split(/[(\r\n)(\n)]/g).length <= 2;
    }, [props.post]);

    const [isExpanded, setExpanded] = React.useState(isExpandedByDefault);

    const processDate = () => {
        const date = props.post.postDate.toLocaleString('pl-PL');
        return date.replace(', ', ' o ');
    }

    const expandPost = React.useCallback(() => {
        setExpanded(true);
        props.registerView([props.post.id]);
    }, [props.post]);

    const processDescription = (description: string): string => {
        if (!isExpanded) {
            if (description.length > nonExpandedPostLength) {
                description = description.substr(0, nonExpandedPostLength);
            }
            if (description.split(/(\r\n)|(\n)/g).length > 2) {
                description = description
                    .split(/(\r\n)|(\n)/g)
                    .slice(0, 2)
                    .join('\n');
            }
            const regex = /^.*\s/g;
            const match = description.match(regex);
            if (match && match[0].length > 70) {
                description = match[0] + '... ';
            } else {
                //let's not clip very long words (does a word over 50 characters long even exist? Probably.)
                description = description + '... ';
            }
        }

        description = description.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');

        return description;

    }

    const createDescription = () => {
        const description = processDescription(props.post.description);
        return (
            <>
                <span
                    dangerouslySetInnerHTML={{
                        __html: description
                    }}
                    style={{wordWrap: 'break-word'}}
                />
                {isExpanded ? null : props.post.postType === PostType.FACT ? (
                    <Link to={'/posts/' + props.post.id} className="postLink">
                        więcej
                    </Link>
                ) : (
                    <a className="postLink" onClick={expandPost}>
                        więcej
                    </a>
                )}
            </>
        );
    }

    const DateSection = () => <div className="postDate fontSizeSmall">{processDate()}</div>

    const TitleSection = () => <div className="postTitle fontSizeLarge">
        {props.post.postType === PostType.FACT ? (
            <p className="basicLink">{props.post.title}</p>
        ) : (
            <a href={postHref} className="basicLink">
                {props.post.title}
            </a>
        )}
    </div>

    const DescriptionSection = () => props.post.postType !== PostType.FACT ?
        <div className="postDescription fontSizeSmall">{createDescription()}</div>
        : null

    const ImagesSection = () => props.post.postType === PostType.FACT ? (
        <>
            <Divider/>
            <div className="factImage">
                <Image
                    publicId={
                        props.post.imagesPublicIds.length > 0
                            ? props.post.imagesPublicIds[0]
                            : 'fb_main_logo_cukiun'
                    }
                    format="png"
                    quality="auto">
                    <Transformation crop="fill" gravity="faces"/>
                </Image>
            </div>
        </>
    ) : (
        props.post.imagesPublicIds.length > 0 ? (
            <>
                <Divider/>
                <ForecastMapList imagesPublicIds={props.post.imagesPublicIds}/>
            </>
        ) : null
    )


    const MainContent = () => {
        return (
            <>
                <DateSection/>
                <br/>
                <TitleSection/>
                <DescriptionSection/>
                <ImagesSection/>
            </>
        );
    }

    return (
        <div className="post">
            {props.post.postType === PostType.FACT ? (
                <a href={postHref}><MainContent/></a>
            ) : <MainContent/>}
        </div>
    );
}

export default PostsListItem;
