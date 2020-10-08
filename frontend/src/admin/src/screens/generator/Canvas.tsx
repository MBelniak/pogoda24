import React from 'react';
import styled from 'styled-components';

class DefaultCanvas extends React.Component {
    public canvas;
    public context;
    // private context: ;
    componentDiDMount() {
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    render() {
        return (
            <div>
                <canvas id="canvas" width="1000" height="666" />
            </div>
        );
    }
}

const Canvas = styled(DefaultCanvas)`
    box-shadow: 0 0 2px black;
`;
export default Canvas;
