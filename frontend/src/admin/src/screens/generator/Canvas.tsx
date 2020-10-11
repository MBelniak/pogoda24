import React from 'react';

export class Canvas extends React.Component {
    static canvasWidth = 1000;
    static canvasHeight = 666;
    render() {
        return (
            <div
                style={{
                    boxShadow: '0 0 15px black',
                    textAlign: 'center',
                    margin: 'auto',
                    width: Canvas.canvasWidth,
                    height: Canvas.canvasHeight
                }}>
                <canvas id="canvas" width={Canvas.canvasWidth} height={Canvas.canvasHeight} />
            </div>
        );
    }
}
