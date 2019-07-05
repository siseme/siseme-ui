import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Button, Input, List, Typography} from 'antd';

import './QueryBar.scss'

@inject('searchStore')
@observer
class QueryBar extends Component {
    render() {
        const {searchStore} = this.props;
        const {history} = this.props;
        return (
            <div className="query-input">
                <div className="row">
                    <Button icon="arrow-left"
                            size="large"
                            type="default"
                            onClick={this.back}/>
                    <Input.Search
                        allowClear
                        ref={(input) => input && input.focus()}
                        size="large"
                        placeholder="지역,아파트명 검색"
                        defaultValue={searchStore.getRegionName}
                        onSearch={this.search}
                        enterButton
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
        history.goBack();
    };
}

export default QueryBar;
