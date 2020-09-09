import React from 'react';
import './ONas.scss';
import config from '../../config/config';

const { cloud_name } = config;

interface Person {
    imagePublicId: string;
    description: string;
}

export default class StaffItem extends React.Component<{ person: Person }> {
    constructor(props) {
        super(props);
    }

    private getDescription() {
        const imgTag = `<img
                        src='http://res.cloudinary.com/${cloud_name}/image/upload/c_fill,g_faces/q_auto/${this.props.person.imagePublicId}'
                        class="ekipaImg"
                    />`;
        return imgTag + this.props.person.description;
    }

    render() {
        return (
            <div className="ekipaItem">
                <p
                    className="ekipaPersonDescription fontSizeSmall"
                    dangerouslySetInnerHTML={{ __html: this.getDescription() }}
                />
            </div>
        );
    }
}
