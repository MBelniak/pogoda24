import React from "react";

interface Person {
    imageURL: string;
    description: string;
}

export default class StaffItem extends React.Component<{person: Person}> {

    constructor(props) {
        super(props);
    }

    private description() {
        return this.props.person.description.replace("\n", "<br/>");
    }

    render() {
        return(
          <div className="ekipaItem">
              <img src={this.props.person.imageURL} className="ekipaImg"/>
              <p className="ekipaPersonDescription" dangerouslySetInnerHTML={{ __html: this.description() }}/>
          </div>
        );
    }

}