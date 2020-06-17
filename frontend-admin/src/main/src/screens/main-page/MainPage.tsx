import React from 'react';
import { Links } from './Links';
const Copyright = require('shared24').Copyright;
const TopImage = require('shared24').TopImage;

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    private renderFlaticonAttribution() {
        return (
            <div className="attribution">
                Icons made by{' '}
                <a href="https://www.flaticon.com/authors/freepik" title="Freepik" target="_blank">
                    Freepik
                </a>
                {', '}
                <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect" target="_blank">
                    Pixel perfect
                </a>
                {', '}
                <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect" target="_blank">
                    Pixel perfect
                </a>
                {', '}
                <a
                    href="https://www.flaticon.com/free-icon/list_847476?term=list&page=2&position=67"
                    title="Kiranshastry"
                    target="_blank">
                    Kiranshastry
                </a>
                {', '}
                <a href="https://www.flaticon.com/authors/itim2101" title="itim2101" target="_blank">
                    itim2101
                </a>
                {', '}
                <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons" target="_blank">
                    Those Icons
                </a>{' '}
                from{' '}
                <a href="https://www.flaticon.com/" title="Flaticon">
                    www.flaticon.com
                </a>
            </div>
        );
    }

    render() {
        return (
            <div className="main">
                <section className="container">
                    <TopImage />
                    <Links />
                </section>
                <Copyright additionalRender={this.renderFlaticonAttribution} />
            </div>
        );
    }
}
