import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Button, Icon, PageHeader, Spin, Table, Typography} from "antd";

import "./DealsChart.scss";
import DealsCountChart from "./DealsCountChart";
import DealsPriceChart from "./DealsPriceChart";
import { Helmet } from "react-helmet";

@inject('searchStore')
@observer
class DealsChart extends Component {
    constructor(props) {
        super(props);
        this.state = this.init();
    };

    init = () => {
        let collapse = localStorage.getItem('collapse.chart');
        if (!collapse) {
            collapse = false;
        } else {
            collapse = JSON.parse(collapse);
        }
        return {collapse: collapse}
    };

    handleCollapse = () => {
        localStorage.setItem('collapse.chart', JSON.stringify(!this.state.collapse));
        this.setState({collapse: !this.state.collapse});
    };

    render() {
        const {searchStore} = this.props;
        return (
            <div className="deals-chart">
                <Spin spinning={searchStore.isRankingLoding}>
                    <PageHeader className="header"
                                title={<Typography.Text className="title">차트<Typography.Text className="collapse"
                                                                                             type="secondary"
                                                                                             onClick={this.handleCollapse}>{this.state.collapse ?
                                    <Icon type="down"/> : <Icon type="up"/>}</Typography.Text></Typography.Text>}
                                footer={
                                    !this.state.collapse &&
                                    <div className="footer">
                                        <Typography.Text
                                            onClick={() => searchStore.handleChartType('count')}
                                            style={{marginRight: 12}}
                                            className={searchStore.chartType === 'count' ? 'selected' : ''}>거래량</Typography.Text>
                                        <Typography.Text
                                            onClick={() => searchStore.handleChartType('price')}
                                            style={{marginRight: 12}}
                                            className={searchStore.chartType === 'price' ? 'selected' : ''}>거래액</Typography.Text>
                                    </div>
                                }/>
                    {
                        !searchStore.isRankingLoding && !this.state.collapse &&
                        <div className="body">
                            {
                                searchStore.chartType === 'count' &&
                                <DealsCountChart/>
                            }
                            {
                                searchStore.chartType === 'price' &&
                                <DealsPriceChart/>
                            }
                        </div>
                    }
                </Spin>
            </div>
        )
    }
}

export default DealsChart;
