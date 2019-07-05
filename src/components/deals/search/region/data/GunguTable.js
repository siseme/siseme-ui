import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import RegionTable from "../RegionTable";

@inject('searchStore')
@observer
class GunguTable extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <RegionTable allRegionType={true}
                         item={searchStore.gungu}
                         itemList={searchStore.gunguList}
                         handleClick={this.handleGunguClick}/>
        )
    }

    handleGunguClick = (region) => {
        const {searchStore, history} = this.props;
        searchStore.setGungu(region);
        searchStore.getDongList();
        if (region.code !== -1) {
            history.push('/search/region/dong');
        }
    };
}

export default GunguTable;
