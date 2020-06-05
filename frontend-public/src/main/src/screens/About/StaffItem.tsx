import React from 'react';
import './ONas.scss'

interface Person {
    imageURL: string;
    description: string;
}

export default class StaffItem extends React.Component<{ person: Person }> {
    constructor(props) {
        super(props);
    }

    private description() {
        return this.props.person.description.replace(/\n/g, '<br/>');
    }

    render() {
        return (
            <div className="ekipaItem">
                <img src={require('img/onas/' + this.props.person.imageURL)} className="ekipaImg" />
                <p
                    className="ekipaPersonDescription fontSizeSmall"
                    dangerouslySetInnerHTML={{ __html: this.description() }}
                />
            </div>
        );
    }
}
