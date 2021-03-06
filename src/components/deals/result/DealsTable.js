import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Button, Input, PageHeader, Table, Typography} from "antd";
import InfiniteScroll from 'react-infinite-scroller';

import "./DealsTable.scss";
import CommonSearchBar from "../../common/CommonSearchBar";

@inject('searchStore')
@observer
class DealsTable extends Component {
    constructor(props) {
        super(props);
        this.state = this.init();
    };

    init = () => {
        return {
            maxPriceFilter: false
        }
    };

    render() {
        const {searchStore} = this.props;
        return (
            <div className="deals-list">
                <PageHeader className="header"
                            title="실거래내역"
                            extra={[
                                <Typography.Text type="secondary" strong={searchStore.sortType === 'date'}
                                                 underline={searchStore.sortType === 'date'}
                                                 onClick={() => this.handleSort('date')}>최신순</Typography.Text>,
                                <Typography.Text type="secondary">|</Typography.Text>,
                                /*
                                                                <Typography.Text type="secondary" onClick={() => this.handleSort('area')}>면적순</Typography.Text>,
                                                                <Typography.Text type="secondary">|</Typography.Text>,
                                */
                                <Typography.Text type="secondary" strong={searchStore.sortType === 'mainPrice'}
                                                 underline={searchStore.sortType === 'mainPrice'}
                                                 onClick={() => this.handleSort('mainPrice')}>가격순</Typography.Text>,
                            ]}
                            footer={
                                <div className="footer">
                                    <Typography.Text style={{marginRight: 12}} underline={!this.state.maxPriceFilter}
                                                     strong={!this.state.maxPriceFilter}
                                                     onClick={() => this.handleFilter(false)}>전체
                                        ({searchStore.dealsList.totalElements ? searchStore.dealsList.totalElements : 0}건)
                                    </Typography.Text>
                                    <Typography.Text type="secondary" underline={this.state.maxPriceFilter}
                                                     strong={this.state.maxPriceFilter}
                                                     onClick={() => this.handleFilter(true)}>신고가
                                        ({searchStore.getMaxPriceDealsSize ? searchStore.getMaxPriceDealsSize : 0}건)</Typography.Text>
                                </div>
                            }/>
                <InfiniteScroll
                    pageStart={searchStore.pageNo}
                    loadMore={this.loadMore}
                    hasMore={this.hasMore}
                >
                    <Table dataSource={this.filter(searchStore.dealsList.contents)}
                           size="small"
                           pagination={false}>
                        <Table.Column
                            align="center"
                            title="날짜"
                            dataIndex="date"
                            key="date"
                            width="20%"
                            render={(date, record) => (
                                <span>
                                {date.substring(2, 4)}.{date.substring(4, 6)}
                                    <br/>
                                    {record.dateName}
                            </span>
                            )}
                        />
                        <Table.Column
                            align="center"
                            title="지역"
                            dataIndex="regionName"
                            key="regionName"
                            width="20%"
                            render={regionName => (
                                <span>
                        {regionName}
                        </span>
                            )}
                        />
                        <Table.Column
                            align="center"
                            title="단지"
                            dataIndex="name"
                            key="name"
                            width="23%"
                            render={name => (
                                <span>
                        {name}
                        </span>
                            )}
                        />
                        <Table.Column
                            align="center"
                            title="전용m²"
                            dataIndex="area"
                            key="area"
                            width="18%"
                            render={area => (
                                <span>
                        {(area * 1).toFixed(2)}
                        </span>
                            )}
                        />
                        <Table.Column
                            align="center"
                            title="가격"
                            dataIndex="price"
                            key="price"
                            width="19%"
                            render={(price, record) => (
                                <span>
                                <Typography.Text>{this.numberWithCommas(price)}</Typography.Text>
                                <br/>
                                <Typography.Text type="secondary"
                                                 style={{fontSize: 12}}>({this.numberWithCommas(record.pastMaxPrice)})</Typography.Text>
                        </span>
                            )}
                        />
                    </Table>
                </InfiniteScroll>
            </div>
        )
    }

    loadMore = () => {
        const {searchStore} = this.props;
        searchStore.appendDealsList();
    };

    hasMore = () => {
        const {searchStore} = this.props;
        searchStore.hasMore();
    };

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    filter = (list) => {
        if (this.state.maxPriceFilter) {
            return list && list.filter(x => x.price > x.pastMaxPrice);
        } else {
            return list;
        }
    };

    handleFilter = (maxPriceFilter) => {
        this.setState({maxPriceFilter: maxPriceFilter});
    };

    handleSort = (sort) => {
        const {searchStore} = this.props;
        searchStore.handleSort(sort);
        searchStore.getDealsList();
    };
}

export default DealsTable;
