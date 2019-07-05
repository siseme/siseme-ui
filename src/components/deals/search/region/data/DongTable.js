import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import RegionTable from "../RegionTable";

@inject('searchStore')
@observer
class DongTable extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <RegionTable allRegionType={true}
                         item={searchStore.dong}
                         itemList={searchStore.dongList}
                         handleClick={this.handleDongClick}/>
        )
    }

    handleDongClick = (region) => {
        const {searchStore, history} = this.props;
        searchStore.setDong(region);
        searchStore.getAptList();
        if (region.code !== -1) {
            history.push('/search/region/apt');
        }
    };
}

export default DongTable;
