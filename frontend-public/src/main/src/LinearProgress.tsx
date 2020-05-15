import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

class CustomLinearProgress extends React.Component<any> {
    render() {
        const { classes } = this.props;
        return <LinearProgress {...this.props} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}/>;
    }
}

const styles = () => ({
    colorPrimary: {
        backgroundColor: 'transparent',
    },
    barColorPrimary: {
        backgroundColor: '#25bfbf',
    }
});

export default  withStyles(styles)(CustomLinearProgress);