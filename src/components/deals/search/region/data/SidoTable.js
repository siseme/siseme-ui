import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import RegionTable from "../RegionTable";

@inject('searchStore')
@observer
class SidoTable extends Component {
    render() {
        const {searchStore} = this.props;
        return (
              <RegionTable allRegionType={false}
                           item={searchStore.sido}
                           itemList={searchStore.sidoList}
                           handleClick={this.handleSidoClick}/>
        )
    }

    handleSidoClick = (region) => {
        const {searchStore, history} = this.props;
        searchStore.setSido(region);
        searchStore.getGunguList();
        if (region.code !== -1) {
            history.push('/search/region/gungu');
        }
    };
}

export default SidoTable;
