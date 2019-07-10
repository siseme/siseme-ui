import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Button, Input, PageHeader, Spin, Table, Typography} from "antd";
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
            <Spin spinning={searchStore.isDataLoding}>
            <div className="deals-list">
                <PageHeader className="header"
                            title="거래 내역"
                            extra={[
                                <Typography.Text className={searchStore.sortType === 'date' ? 'selected' : ''}
                                                 onClick={() => this.handleSort('date')}>최신순</Typography.Text>,
                                <Typography.Text type="secondary">|</Typography.Text>,
                                /*
                                                                <Typography.Text type="secondary" onClick={() => this.handleSort('area')}>면적순</Typography.Text>,
                                                                <Typography.Text type="secondary">|</Typography.Text>,
                                */
                                <Typography.Text className={searchStore.sortType === 'mainPrice' ? 'selected' : ''}
                                                 onClick={() => this.handleSort('mainPrice')}>가격순</Typography.Text>,
                            ]}
                            footer={
                                <div>
                                    <div className="footer">
                                        {
                                            (searchStore.dealsList.totalElements ? searchStore.dealsList.totalElements : 0) === 0 ?
                                                <Typography.Text style={{marginRight: 12}} delete>거래없음</Typography.Text> :
                                                <Typography.Text style={{marginRight: 12}}
                                                                 className={!this.state.maxPriceFilter && !this.state.newItemFilter ? 'selected' : ''}
                                                                 onClick={() => this.handleNoneFilter(true)}>전체
                                                    ({this.numberWithCommas(searchStore.dealsList.totalElements ? searchStore.dealsList.totalElements : 0)}건)
                                                </Typography.Text>
                                        }
                                        {
                                            (searchStore.resultCount ? searchStore.resultCount.maxPriceCount : 0) === 0 ?
                                                <Typography.Text style={{marginRight: 12}} delete>신고가없음</Typography.Text> :
                                                <Typography.Text style={{marginRight: 12}}
                                                                 className={this.state.maxPriceFilter ? 'selected' : ''}
                                                                 onClick={() => this.handleMaxPriceFilter(true)}>신고가
                                                    ({this.numberWithCommas(searchStore.resultCount ? searchStore.resultCount.maxPriceCount : 0)}건)</Typography.Text>
                                        }
                                        {
                                            (searchStore.resultCount ? searchStore.resultCount.newItemCount : 0) === 0 ?
                                                <Typography.Text delete>신규없음</Typography.Text> :
                                                <Typography.Text className={this.state.newItemFilter ? 'selected' : ''}
                                                                 onClick={() => this.handleNewItem(true)}>신규
                                                    ({this.numberWithCommas(searchStore.resultCount ? searchStore.resultCount.newItemCount : 0)}건)</Typography.Text>
                                        }
                                    </div>
                                </div>
                            }/>
                <InfiniteScroll
                    pageStart={searchStore.pageNo}
                    loadMore={this.loadMore}
                    hasMore={this.hasMore}
                >
                    <Table className="table"
                           dataSource={this.filter(searchStore.dealsList.contents)}
                           size="small"
                           pagination={false}>
                        <Table.Column
                            align="center"
                            title="날짜"
                            dataIndex="date"
                            key="date"
                            width="20%"
                            render={(date, record) => (
                                <span>{date.substring(0, 4)}
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
                                <span>{regionName}</span>
                            )}
                        />
                        <Table.Column
                            align="center"
                            title="단지"
                            dataIndex="name"
                            key="name"
                            width="23%"
                            render={name => (
                                <span>{name}</span>
                            )}
                        />
                        <Table.Column
                            align="center"
                            title="전용m²"
                            dataIndex="area"
                            key="area"
                            width="18%"
                            render={area => (
                                <span>{(area * 1).toFixed(2)}</span>
                            )}
                        />
                        {
                            searchStore.tradeType === 'rent' ?
                                <Table.Column
                                    align="center"
                                    title="가격"
                                    dataIndex="price"
                                    key="price"
                                    width="19%"
                                    render={(price, record) => (
                                        <span>
                                                        <Typography.Text>{this.numberWithCommas(price)}</Typography.Text>
                                            {
                                                record.subPrice > 0 &&
                                                <Typography.Text><br/>/{this.numberWithCommas(record.subPrice)}</Typography.Text>
                                            }
                                                        <br/>
                                            {
                                                !record.subPrice > 0 &&
                                                    <Typography.Text>전세</Typography.Text>
                                            }
                                                    </span>
                                    )}
                                /> :
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
                                                        <Typography.Text
                                                            type="secondary">({this.numberWithCommas(record.pastMaxPrice)})</Typography.Text>
                                                    </span>
                                    )}
                                />
                        }
                    </Table>
                </InfiniteScroll>
            </div>
            </Spin>
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
        } else if (this.state.newItemFilter) {
            return list && list.filter(x => x.isNewData);
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
