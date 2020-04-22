import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Traffic from './Traffic';
import MainPage from './MainPage';
import PostsList from './PostsList';
import Writer from './Writer';
import { connect, ConnectedProps } from 'react-redux';
import { ModalWindowState } from './redux/store';
const ModalWindow = require('shared24').ModalWindow;
const connector = connect((state: ModalWindowState) => ({
    modalShown: state.isShown,
    modalRender: state.render
}));

type PropsFromRedux = ConnectedProps<typeof connector>;

class App extends React.Component<PropsFromRedux> {
    render() {
        return (
            <Router>
                <ModalWindow
                    isShown={this.props.modalShown}
                    render={this.props.modalRender}
                />
                <Switch>
                    <Route exact path="/write" component={MainPage} />
                    <Route path="/writer" component={Writer} />
                    <Route path="/elist" component={PostsList} />
                    <Route path="/traffic" component={Traffic} />
                </Switch>
            </Router>
        );
    }
}

export default connector(App);
