import React, {Component} from 'react';
import AdSense from 'react-adsense';
import {inject, observer} from 'mobx-react/index';
import {Button, Icon, PageHeader, Spin, Table, Typography} from "antd";

import "./DealsRankingTable.scss";

@inject('searchStore')
@observer
class DealsRankingTable extends Component {
    constructor(props) {
        super(props);
        this.state = this.init();
    };

    init = () => {
        let collapse = localStorage.getItem('collapse.ranking');
        if (!collapse) {
            collapse = false;
        } else {
            collapse = JSON.parse(collapse);
        }
        return {collapse: collapse}
    };

    handleCollapse = () => {
        localStorage.setItem('collapse.ranking', JSON.stringify(!this.state.collapse));
        this.setState({collapse: !this.state.collapse});
    };

    render() {
        const {searchStore} = this.props;
        return (
            <React.Fragment>
                <AdSense.Google
                    client='ca-pub-7358131203333812'
                    slot='1000729200'
                    style={{display: 'block'}}
                    format='auto'
                    responsive='true'
                />
            <div className="deals-ranking-table">
                <Spin spinning={searchStore.isRankingLoding}>
                    <PageHeader className="header"
                                title={<Typography.Text className="title">랭킹<Typography.Text className="collapse"
                                                                                             type="secondary"
                                                                                             onClick={this.handleCollapse}>{this.state.collapse ?
                                    <Icon type="down"/> : <Icon type="up"/>}</Typography.Text></Typography.Text>}
                                footer={
                                    !this.state.collapse &&
                                    <div className="footer">
                                        <Typography.Text
                                            onClick={() => searchStore.handleRankType('numberOfTradeRanks')}
                                            style={{marginRight: 12}}
                                            className={searchStore.rankType === 'numberOfTradeRanks' ? 'selected' : ''}>거래량</Typography.Text>
                                        {
                                            searchStore.tradeType === 'trade' &&
                                            <Typography.Text
                                                onClick={() => searchStore.handleRankType('numberOfNewHighPriceRanks')}
                                                style={{marginRight: 12}}
                                                className={searchStore.rankType === 'numberOfNewHighPriceRanks' ? 'selected' : ''}>신고가</Typography.Text>
                                        }
                                        {
                                            searchStore.tradeType === 'trade' &&
                                            <Typography.Text
                                                onClick={() => searchStore.handleRankType('unitPriceRanks')}
                                                className={searchStore.rankType === 'unitPriceRanks' ? 'selected' : ''}>평당가</Typography.Text>
                                        }
                                    </div>
                                }/>
                    {
                        !this.state.collapse &&
                        searchStore.tradeType === 'trade' &&
                        <Table className="table"
                               dataSource={this.filter(searchStore.rankResult)}
                               size="small"
                               pagination={false}>
                            <Table.Column
                                align="center"
                                title="순위"
                                dataIndex="ranking"
                                key="ranking"
                                width="20%"
                                render={ranking => (
                                    <Typography.Text>
                                        {ranking}
                                    </Typography.Text>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="지역"
                                dataIndex="regionName"
                                key="regionName"
                                width="60%"
                                render={regionName => (
                                    <Typography.Text>
                                        {regionName}
                                    </Typography.Text>
                                )}
                            />
                            {
                                searchStore.rankType === 'numberOfTradeRanks' &&
                                <Table.Column
                                    align="center"
                                    title="건수"
                                    dataIndex="count"
                                    key="count"
                                    width="20%"
                                    render={count => (
                                        <Typography.Text>
                                            {this.numberWithCommas(count)}건
                                        </Typography.Text>
                                    )}
                                />
                            }
                            {
                                searchStore.rankType === 'numberOfNewHighPriceRanks' &&
                                <Table.Column
                                    align="center"
                                    title="건수"
                                    dataIndex="newHighPriceCount"
                                    key="newHighPriceCount"
                                    width="20%"
                                    render={newHighPriceCount => (
                                        <Typography.Text>
                                            {this.numberWithCommas(newHighPriceCount)}건
                                        </Typography.Text>
                                    )}
                                />
                            }
                            {
                                searchStore.rankType === 'unitPriceRanks' &&
                                <Table.Column
                                    align="center"
                                    title="가격"
                                    dataIndex="unitPrice"
                                    key="unitPrice"
                                    width="20%"
                                    render={unitPrice => (
                                        <Typography.Text>
                                            <Typography.Text>{this.numberWithCommas((unitPrice * 1).toFixed(0))}</Typography.Text>만
                                        </Typography.Text>
                                    )}
                                />
                            }
                        </Table>
                    }
                    {
                        !this.state.collapse && searchStore.tradeType === 'ticket' &&
                        <Table className="table"
                               dataSource={searchStore.rankResult.ticketCountRanks}
                               size="small"
                               pagination={false}>
                            <Table.Column
                                align="center"
                                title="순위"
                                dataIndex="ranking"
                                key="ranking"
                                width="20%"
                                render={ranking => (
                                    <Typography.Text>
                                        {ranking}
                                    </Typography.Text>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="지역"
                                dataIndex="regionName"
                                key="regionName"
                                width="60%"
                                render={regionName => (
                                    <Typography.Text>
                                        {regionName}
                                    </Typography.Text>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="건수"
                                dataIndex="count"
                                key="count"
                                width="20%"
                                render={count => (
                                    <Typography.Text>
                                        {this.numberWithCommas(count)}건
                                    </Typography.Text>
                                )}
                            />
                        </Table>
                    }
                    {
                        !this.state.collapse && searchStore.tradeType === 'rent' &&
                        <Table className="table"
                               dataSource={searchStore.rankResult.rentCountRanks}
                               size="small"
                               pagination={false}>
                            <Table.Column
                                align="center"
                                title="순위"
                                dataIndex="ranking"
                                key="ranking"
                                width="20%"
                                render={ranking => (
                                    <Typography.Text>
                                        {ranking}
                                    </Typography.Text>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="지역"
                                dataIndex="regionName"
                                key="regionName"
                                width="60%"
                                render={regionName => (
                                    <Typography.Text>
                                        {regionName}
                                    </Typography.Text>
                                )}
                            />
                            <Table.Column
                                align="center"
                                title="건수"
                                dataIndex="count"
                                key="count"
                                width="20%"
                                render={count => (
                                    <Typography.Text>
                                        {this.numberWithCommas(count)}건
                                    </Typography.Text>
                                )}
                            />
                        </Table>
                    }
                </Spin>
            </div>
            </React.Fragment>
        )
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    filter = (result) => {
        const {searchStore} = this.props;
        return result[searchStore.rankType];
    };
}

export default DealsRankingTable;
