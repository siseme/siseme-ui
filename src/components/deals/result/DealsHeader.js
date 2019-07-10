import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import CommonSearchBar from "../../common/CommonSearchBar";

import "./DealsHeader.scss";

@inject('searchStore')
@observer
class DealsHeader extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <CommonSearchBar className="deals-header"
                             handleInput={this.handleInput}
                             placeholder="지역,아파트명 검색"
                             value={searchStore.getRegionName}
                             handleSearch={this.handleSearch}/>
        )
    }

    handleButton = () => {
        const {history} = this.props;
        history.push('/');
    };

    handleInput = () => {
        const {searchStore} = this.props;
        const {history} = this.props;
        history.push('/search/region/sido');
        searchStore.setBackUrl('/list');
        searchStore.regionSearch(searchStore.getKeywordName);
    };

    handleSearch = () => {
        const {searchStore} = this.props;
        const {history} = this.props;
        searchStore.getDealsList();
    };
}

export default DealsHeader;
