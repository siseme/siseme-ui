import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {List, Typography} from 'antd';

import './QueryTable.scss'

@inject('searchStore')
@observer
class QueryTable extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <List
                header={<Typography.Text strong>검색결과 {searchStore.searchList.length}개</Typography.Text>}
                bordered
                dataSource={searchStore.searchList}
                renderItem={item => (
                    <List.Item onClick={() => this.handleRegion(item)}>
                        <Typography.Text>{item.fullName}</Typography.Text>
                    </List.Item>
                )}
            />
        )
    }

    handleRegion = (region) => {
        const {searchStore} = this.props;
        const {history} = this.props;
        searchStore.handleRegion(region);
        searchStore.getDealsList();
        history.push('/list');
    };
}

export default QueryTable;
