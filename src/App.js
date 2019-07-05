import React from 'react';

import SearchContainer from "./components/search/SearchContainer";
import DealsResultContainer from "./components/deals/result/DealsResultContainer";
import DealsSearchContainer from "./components/deals/search/DealsSearchContainer";

import './styles/styles.css';

function App(props) {
    return (
        <React.Fragment>
            <DealsSearchContainer history={props.history}/>
            <DealsResultContainer history={props.history}/>
{/*            <SearchContainer history={props.history}/>
            <DealsResultContainer history={props.history}/>*/}
        </React.Fragment>
    );
}

export default (App);
