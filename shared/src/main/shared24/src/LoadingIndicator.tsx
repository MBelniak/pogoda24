import React from 'react';
import Loader from 'react-loader-spinner'
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

export class LoadingIndicator extends React.Component<{isShown: boolean}> {

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
        return (
                <Modal isOpen={this.props.isShown}
                         style={customStyles}>
                    <Loader type="Oval"
                            color="#23425f"
                            visible={true}
                            height={100}
                            width={100}/>
                </Modal>
        )
    }
}