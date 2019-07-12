import React from 'react';
import DealsResultContainer from "./components/deals/result/DealsResultContainer";
import DealsSearchContainer from "./components/deals/search/DealsSearchContainer";

import './styles/styles.css';
import DealsHeader from "./components/deals/result/DealsHeader";
import {Route} from "react-router-dom";
import Redirect from "./components/redirect/Redirect";

function App(props) {
    return (
        <React.Fragment>
            <DealsSearchContainer history={props.history}/>
            <DealsResultContainer history={props.history}/>
            <Route path="/r" component={Redirect}/>
{/*            <SearchContainer history={props.history}/>
            <DealsResultContainer history={props.history}/>*/}
        </React.Fragment>
    );
}

export default (App);
