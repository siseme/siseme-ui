import React from 'react';
import {Route} from "react-router-dom";
import Home from "./Home";

function HomeContainer(props) {
    return (
        <React.Fragment>
            <Route exact path="/" component={Home}/>
        </React.Fragment>
    );
}

export default HomeContainer;
