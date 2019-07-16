import React, {Component} from 'react';
import {Button, Col, Row, Spin, Typography} from "antd";

import "./DealsTabs.scss";
import {inject, observer} from "mobx-react";

@inject('searchStore')
@observer
class DealsTabs extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <Spin spinning={searchStore.isRankingLoding && searchStore.isDataLoding && searchStore.isRankingLoding}>
                <div className="deals-tabs">
                    <div>
                        <Button className="button" size="medium"
                                onClick={this.handleStartDateOpen}>{searchStore.startDate.format('YYYY.MM')}</Button>
                        <Button className="button" size="medium"
                                onClick={this.handleEndDateOpen}>{searchStore.endDate.format('YYYY.MM')}</Button>
                    </div>
                    {
                        this.props.itemList.map((x, idx) => (
                            <Button size="medium"
                                    className={searchStore.tradeType === x.type ? 'button selected' : 'button'}
                                    onClick={() => this.handleTradeType(x.type)}>{x.name}</Button>
                            /*
                                                    <Col key={idx} className="row" span={(24 / this.props.itemList.length)}>
                                                        <a className={searchStore.tradeType === x.type ? 'selected' : ''} href="javascript:void(0)"
                                                           onClick={() => this.handleTradeType(x.type)}>
                                                            <Typography.Text>{x.name}</Typography.Text>
                                                        </a>
                                                    </Col>
                            */
                        ))
                    }
                </div>
            </Spin>
        );
    }

    handleTradeType = (tradeType) => {
        const {searchStore} = this.props;
        searchStore.handleTradeType(tradeType);
    };
}

export default DealsTabs;
