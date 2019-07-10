import React from 'react';
import {Route} from "react-router-dom";
import DealsTable from "./DealsTable";
import DealsHeader from "./DealsHeader";
import CommonDateBar from "../../common/CommonDateBar";
import DealsRankingTable from "./DealsRankingTable";
import CommonTabs from "../../common/CommonTabs";
import DealsTabs from "./DealsTabs";

const tabs = [
    {
        type: 'trade',
        name: '실거래',
    },
    {
        type: 'ticket',
        name: '분양권',
    },
    {
        type: 'rent',
        name: '전월세',
    },
    /*
        {
            path: '/search/best',
            name: '인기검색',
        },
    */
    /*
        {
            path: '/search/bookmark',
            name: '북마크',
        },
    */
];

function DealsResultContainer(props) {
    return (
        <React.Fragment>
            <Route exact path="/" component={DealsHeader}/>
            <Route exact path="/" component={(e) => <DealsTabs itemList={tabs}/>}/>
            <Route exact path="/" component={CommonDateBar}/>
            <Route exact path="/" component={DealsRankingTable}/>
            <Route exact path="/" component={DealsTable}/>
        </React.Fragment>
    );
}

export default DealsResultContainer;
