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
            maxPriceFilter: false,
            newItemFilter: false
        }
    };

    render() {
        const {searchStore} = this.props;
        return (
            <div className="deals-list">
                <PageHeader className="header"
                            title="실거래내역"
                            extra={[
                                <Typography.Text mark={searchStore.sortType === 'date'}
                                                 onClick={() => this.handleSort('date')}>최신순</Typography.Text>,
                                <Typography.Text type="secondary">|</Typography.Text>,
                                /*
                                                                <Typography.Text type="secondary" onClick={() => this.handleSort('area')}>면적순</Typography.Text>,
                                                                <Typography.Text type="secondary">|</Typography.Text>,
                                */
                                <Typography.Text mark={searchStore.sortType === 'mainPrice'}
                                                 onClick={() => this.handleSort('mainPrice')}>가격순</Typography.Text>,
                            ]}
                            footer={
                                <div className="footer">
                                    <Typography.Text style={{marginRight: 12}}
                                                     mark={!this.state.maxPriceFilter && !this.state.newItemFilter}
                                                     onClick={() => this.handleNoneFilter(true)}>전체
                                        ({searchStore.dealsList.totalElements ? searchStore.dealsList.totalElements : 0}건)
                                    </Typography.Text>
                                    <Typography.Text style={{marginRight: 12}}
                                                     mark={this.state.maxPriceFilter}
                                                     onClick={() => this.handleMaxPriceFilter(true)}>신고가
                                        ({searchStore.getMaxPriceDealsSize ? searchStore.getMaxPriceDealsSize : 0}건)</Typography.Text>
                                    <Typography.Text mark={this.state.newItemFilter}
                                                     onClick={() => this.handleNewItem(true)}>신규
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
                                {date.substring(0, 4)}
                                <br/>
                                {date.substring(4, 6)}.{this.getDayName(record.dateName)}
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
                                <Typography.Text type={price > record.pastMaxPrice && 'danger'}
                                                 strong={price > record.pastMaxPrice && 'danger'}>{this.numberWithCommas(price)}</Typography.Text>
                                <br/>
                                <Typography.Text type="secondary">({this.numberWithCommas(record.pastMaxPrice)})</Typography.Text>
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

    handleNoneFilter = () => {
        this.setState({maxPriceFilter: false, newItemFilter: false});
    };

    handleMaxPriceFilter = (maxPriceFilter) => {
        this.setState({maxPriceFilter: maxPriceFilter, newItemFilter: false});
    };

    handleNewItem = (newItemFilter) => {
        this.setState({maxPriceFilter: false, newItemFilter: newItemFilter});
    };

    handleSort = (sort) => {
        const {searchStore} = this.props;
        searchStore.handleSort(sort);
        searchStore.getDealsList();
    };

    getDayName = (value) => {
        return value.length < 2 ? '0' + value : value;
    };
}

export default DealsTable;
