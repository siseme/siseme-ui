import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Button, Input} from 'antd';

import './QueryBar.scss'

@inject('searchStore')
@observer
class QueryBar extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <div className="query-input">
                <div className="row">
                    <Button className="back-btn"
                            icon="arrow-left"
                            size="large"
                            type="default"
                            onClick={this.back}/>
                    <Input.Search
                        className='input-search'
                        ref={(input) => input && input.focus()}
                        size="large"
                        placeholder="지역,아파트명 검색"
                        defaultValue={searchStore.getRegionName}
                        onSearch={this.search}
                        enterButton="검색"
                    />
                </div>
            </div>
        )
    }

    search = (query) => {
        const {searchStore} = this.props;
        searchStore.regionSearch(query);
    };

    back = () => {
        const {history} = this.props;
        history.push('/search/region/sido');
    };
}

export default QueryBar;
