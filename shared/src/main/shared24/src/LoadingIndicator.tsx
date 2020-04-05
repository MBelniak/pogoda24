import React from 'react';
import Loader from 'react-loader-spinner'

export class LoadingIndicator extends React.Component {

    render() {
        return (
            <Loader type="Oval"
                    color="#23425f"
                    visible={true}
                    height={100}
                    width={100}/>
        )
    }
}