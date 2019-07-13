import React from 'react';
import {Route} from "react-router-dom";
import DealsTable from "./DealsTable";
import DealsHeader from "./DealsHeader";
import CommonDateBar from "../../common/CommonDateBar";
import DealsRankingTable from "./DealsRankingTable";
import DealsChart from "./DealsChart";

function DealsResultContainer(props) {
    return (
        <React.Fragment>
            <Route exact path="/" component={DealsHeader}/>
            <Route exact path="/" component={CommonDateBar}/>
            <Route exact path="/" component={DealsRankingTable}/>
            <Route exact path="/" component={DealsChart}/>
            <Route exact path="/" component={DealsTable}/>
        </React.Fragment>
    );
}

export default DealsResultContainer;
