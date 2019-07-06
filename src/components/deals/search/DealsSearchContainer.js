import React from 'react';
import {Route, Switch} from "react-router-dom";

import CommonTabs from "../../common/CommonTabs";
import SidoTable from "./region/data/SidoTable";
import GunguTable from "./region/data/GunguTable";
import DongTable from "./region/data/DongTable";
import AptTable from "./region/data/AptTable";
import RegionBar from "./region/RegionBar";
import CommonSubTabs from "../../common/CommonSubTabs";
import QueryBar from "./query/QueryBar";
import QueryTable from "./query/QueryTable";

const tabs = [
    {
        path: '/search/history',
        name: '최근검색',
    },
    {
        path: '/search/region',
        name: '지역검색',
    },
    {
        path: '/search/best',
        name: '인기검색',
    },
    {
        path: '/search/bookmark',
        name: '북마크',
    },
];

const subTabs = [
    {
        path: '/search/region/sido',
        name: '광역시/도',
    },
    {
        path: '/search/region/gungu',
        name: '시/군/구',
    },
    {
        path: '/search/region/dong',
        name: '동',
    },
    {
        path: '/search/region/apt',
        name: '아파트',
    },
];

function DealsSearchContainer(props) {
    return (
        <React.Fragment>
            <Route path="/query" component={QueryBar}/>
            <Route path="/query" component={QueryTable}/>
            <Route path="/search" component={RegionBar}/>
            <Route path="/search" component={() => <CommonTabs itemList={tabs}/>}/>
            <Route path="/search/region" component={() => <CommonSubTabs itemList={subTabs}/>}/>
            <Route path="/search/region/sido" component={SidoTable}/>
            <Route path="/search/region/gungu" component={GunguTable}/>
            <Route path="/search/region/dong" component={DongTable}/>
            <Route path="/search/region/apt" component={AptTable}/>
        </React.Fragment>
    );
}

export default DealsSearchContainer;
