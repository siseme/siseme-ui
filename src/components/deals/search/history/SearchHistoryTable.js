import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {List, Typography} from 'antd';
import moment from "moment";

import './SearchHistoryTable.scss'

@inject('searchStore')
@observer
class SearchHistoryTable extends Component {
    render() {
        const {searchStore} = this.props;
        const data = this.getData();
        return (
            <List
                className="search-history-table"
                header={<Typography.Text strong>검색순 {data.length}개</Typography.Text>}
                bordered
                dataSource={data}
                renderItem={item => (
                    <List.Item onClick={() => this.handleRegion(item)} className={searchStore.getRegion.code === item.region.code ? 'selected' : ''}>
                        <div className="row">
                            <div>
                                <Typography.Text>{item.region.fullName}</Typography.Text>
                            </div>
                            <div>
                                <Typography.Text
                                    type="secondary">{moment(item.searchDate).format('YYYY.MM.DD HH:mm:ss')}</Typography.Text>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        )
    }

    getData = () => {
        let result = JSON.parse(localStorage.getItem('search.params.list')).filter(x => x.region.code !== -1);
        return result ? result : [];
    };

    handleRegion = (item) => {
        const {searchStore, history} = this.props;
        searchStore.handleRegion(item.region);
        searchStore.getDealsList();
        history.push('/');
    };
}

export default SearchHistoryTable;
