import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import RegionTable from "../RegionTable";

@inject('searchStore')
@observer
class AptTable extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <RegionTable allRegionType={true}
                         item={searchStore.apt}
                         itemList={searchStore.aptList}
                         handleClick={this.handleAptClick}/>
        )
    }

    handleAptClick = (region) => {
        const {searchStore} = this.props;
        searchStore.setApt(region);
    };
}

export default AptTable;
