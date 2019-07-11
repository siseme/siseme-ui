import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {PageHeader, Spin, Table, Typography} from "antd";

import "./DealsRankingTable.scss";

@inject('searchStore')
@observer
class DealsRankingTable extends Component {
    constructor(props) {
        super(props);
        this.state = this.init();
    };

    init = () => {
        return {}
    };

    render() {
        const {searchStore} = this.props;
        return (
            <div className="deals-ranking-table">
                <Spin spinning={searchStore.isRankingLoding}>
                    <PageHeader className="header"
                                title="랭킹"
                                footer={
                                    <div className="footer">
                                        <Typography.Text onClick={() => searchStore.handleRankType('numberOfTradeRanks')}
                                                         style={{marginRight: 12}}
                                                         className={searchStore.rankType === 'numberOfTradeRanks' ? 'selected' : ''}>거래량</Typography.Text>
                                        {
                                            searchStore.tradeType === 'trade' &&
                                            <Typography.Text onClick={() => searchStore.handleRankType('numberOfNewHighPriceRanks')}
                                                             style={{marginRight: 12}}
                                                             className={searchStore.rankType === 'numberOfNewHighPriceRanks' ? 'selected' : ''}>신고가</Typography.Text>
                                        }
                                        {
                                            searchStore.tradeType === 'trade' &&
                                            <Typography.Text onClick={() => searchStore.handleRankType('unitPriceRanks')}
                                                             className={searchStore.rankType === 'unitPriceRanks' ? 'selected' : ''}>평당가</Typography.Text>
                                        }
                                    </div>
                                }/>
                    {
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
                        searchStore.tradeType === 'ticket' &&
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
                        searchStore.tradeType === 'rent' &&
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
