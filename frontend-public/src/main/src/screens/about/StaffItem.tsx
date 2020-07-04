import React from 'react';
import './ONas.scss';

interface Person {
    imageURL?: string;
    description: string;
}

export default class StaffItem extends React.Component<{ person: Person }> {
    constructor(props) {
        super(props);
    }

    private description() {
        const imgTag = this.props.person.imageURL
            ? '<img src="' + require('img/onas/' + this.props.person.imageURL) + '" class="ekipaImg"/>'
            : '<div class="ekipaImg"/>';
        return imgTag + this.props.person.description.replace(/\n/g, '<br/>');
    }

    render() {
        return (
            <div className="ekipaItem">
                <p
                    className="ekipaPersonDescription fontSizeSmall"
                    dangerouslySetInnerHTML={{ __html: this.description() }}
                />
            </div>
        );
    }
}
