import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

class CustomLinearProgress extends React.Component<any> {
    render() {
        const { classes, ...rest } = this.props;
        return <LinearProgress {...rest} classes={{colorPrimary: classes.colorPrimary, barColorPrimary: classes.barColorPrimary}}/>;
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

export default withStyles(styles)(CustomLinearProgress);