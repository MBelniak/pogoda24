import React from 'react';
import ReactDOM from 'react-dom';
import TopBar from "./TopBar";
import BarHolder from "./BarHolder";
import MainContent from "./MainContent";

ReactDOM.render(
    <div className="mainFrame">
        <BarHolder/>
        <TopBar/>
        <MainContent/>
    </div>
    , document.getElementById('root'));

