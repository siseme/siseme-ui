import React from 'react';
import {Route} from "react-router-dom";
import DealsTable from "./DealsTable";
import DealsHeader from "./DealsHeader";

function DealsResultContainer(props) {
    return (
        <React.Fragment>
            <Route exact path="/list" component={DealsHeader}/>
            <Route exact path="/list" component={DealsTable}/>
        </React.Fragment>
    );
}

export default DealsResultContainer;
