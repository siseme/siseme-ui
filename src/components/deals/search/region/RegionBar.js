import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import CommonSearchBar from "../../../common/CommonSearchBar";

import './RegionBar.scss';

@inject('searchStore')
@observer
class RegionBar extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <React.Fragment>
                <CommonSearchBar icon="arrow-left"
                                 placeholder="지역,아파트명 검색"
                                 value={searchStore.getRegionName}
                                 handleButton={this.handleButton}
                                 handleInput={this.handleInput}
                                 handleSearch={this.handleSearch}/>
            </React.Fragment>
        )
    }

    handleInput = () => {
        const {searchStore} = this.props;
        const {history} = this.props;
        history.push('/query');
        searchStore.regionSearch(searchStore.getKeywordName);
    };

    handleButton = () => {
        const {searchStore} = this.props;
        const {history} = this.props;
        history.push(searchStore.backUrl);
    };

    handleSearch = () => {
        const {searchStore} = this.props;
        const {history} = this.props;
        searchStore.getDealsList();
        history.push('/');
    };
}

export default RegionBar;
