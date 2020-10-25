import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Icon, PageHeader, Spin, Table, Typography} from "antd";
import InfiniteScroll from 'react-infinite-scroller';
import Coupang from '../search/region/Coupang';

import "./DealsTable.scss";

@inject('searchStore')
@observer
class DealsTable extends Component {
    constructor(props) {
        super(props);
        this.state = this.init();
    };

    init = () => {
        let collapse = localStorage.getItem('collapse.list');
        if (!collapse) {
            collapse = false;
        } else {
            collapse = JSON.parse(collapse);
        }
        return {collapse: collapse}
    };

    handleCollapse = () => {
        localStorage.setItem('collapse.list', JSON.stringify(!this.state.collapse));
        this.setState({collapse: !this.state.collapse});
    };

    render() {
        const {searchStore} = this.props;
        return (
            <Spin spinning={searchStore.isDataLoding}>
            <div className="deals-list">
                <PageHeader className="header"
                            title={<Typography.Text className="title">거래 내역<Typography.Text className="collapse"
                                                                                         type="secondary"
                                                                                         onClick={this.handleCollapse}>{this.state.collapse ?
                                <Icon type="down"/> : <Icon type="up"/>}</Typography.Text></Typography.Text>}
                            footer={
                                !this.state.collapse &&
                                <div className="footer">
                                    <div className="trade-type">
                                        {
                                            (searchStore.dealsList.totalElements ? searchStore.dealsList.totalElements : 0) === 0 ?
                                                <Typography.Text style={{marginRight: 12}} delete>거래없음</Typography.Text> :
                                                <Typography.Text style={{marginRight: 12}}
                                                                 className={!searchStore.maxPriceFilter && !searchStore.newItemFilter ? 'selected' : ''}
                                                                 onClick={searchStore.handleNoneFilter}>총 {this.numberWithCommas(searchStore.dealsList.totalElements ? searchStore.dealsList.totalElements : 0)}건
                                                </Typography.Text>
                                        }
                                        {
                                            (searchStore.resultCount ? searchStore.resultCount.maxPriceCount : 0) === 0 ?
                                                <Typography.Text style={{marginRight: 12}} delete>신고가없음</Typography.Text> :
                                                <Typography.Text style={{marginRight: 12}}
                                                                 className={searchStore.maxPriceFilter ? 'selected' : ''}
                                                                 onClick={() => searchStore.handleMaxPriceFilter(true)}>신고가 {this.numberWithCommas(searchStore.resultCount ? searchStore.resultCount.maxPriceCount : 0)}건</Typography.Text>
                                        }
                                        {
                                            (searchStore.resultCount ? searchStore.resultCount.newItemCount : 0) === 0 ?
                                                <Typography.Text delete>신규없음</Typography.Text> :
                                                <Typography.Text className={searchStore.newItemFilter ? 'selected' : ''}
                                                                 onClick={() => searchStore.handleNewItemFilter(true)}>신규 {this.numberWithCommas(searchStore.resultCount ? searchStore.resultCount.newItemCount : 0)}건</Typography.Text>
                                        }
                                    </div>
{/*                                    <div className="sort-type">
                                        <Typography.Text key={0} className={searchStore.sortType === 'date' ? 'selected' : ''}
                                                         onClick={() => this.handleSort('date')}>최신순</Typography.Text>
                                        <Typography.Text key={1} type="secondary">|</Typography.Text>
                                        <Typography.Text key={2} className={searchStore.sortType === 'mainPrice' ? 'selected' : ''}
                                                         onClick={() => this.handleSort('mainPrice')}>가격순</Typography.Text>
                                    </div>*/}
                                </div>
                            }/>
                {
                    !this.state.collapse &&
                    <InfiniteScroll
                        pageStart={searchStore.pageNo}
                        loadMore={this.loadMore}
                        hasMore={searchStore.hasMore}
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
                                width="18%"
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
                                width="18%"
                                render={regionName => (
                                    <span>{regionName}</span>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="단지"
                                dataIndex="name"
                                key="name"
                                width="21%"
                                render={name => (
                                    <span>{name}</span>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="층"
                                dataIndex="floor"
                                key="floor"
                                width="10%"
                                render={floor => (
                                    <span>{floor}</span>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="전용m²"
                                dataIndex="area"
                                key="area"
                                width="16%"
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
                                        width="17%"
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
                                        width="17%"
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
                }
            </div>
            </Spin>
        )
    }

    loadMore = () => {
        const {searchStore} = this.props;
        searchStore.appendDealsList();
    };

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    filter = (list) => {
        const {searchStore} = this.props;
        if (searchStore.maxPriceFilter) {
            return list && list.filter(x => x.price > x.pastMaxPrice);
        } else if (searchStore.newItemFilter) {
            return list && list.filter(x => x.isNewData);
        } else {
            return list;
        }
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
