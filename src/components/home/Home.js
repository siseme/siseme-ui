import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Input} from "antd";

import "./Home.scss";

@inject('searchStore')
@observer
class Home extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <div className="home">
                <Input.Search onClick={this.handleClick}
                              size="large"
                              placeholder="지역,아파트명 검색"
                              value={searchStore.getRegionName}
                              enterButton
                />
            </div>
        )
    }

    handleClick = () => {
        const {searchStore} = this.props;
        const {history} = this.props;
        history.push('/search/history');
        searchStore.setBackUrl('/');
        searchStore.regionSearch(searchStore.getKeywordName);
    };
}

export default Home;
