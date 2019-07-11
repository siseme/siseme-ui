import React, {Component} from 'react';
import {Col, Row, Spin, Typography} from "antd";

import "./DealsTabs.scss";
import {inject, observer} from "mobx-react";

@inject('searchStore')
@observer
class DealsTabs extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <Spin spinning={searchStore.isDataLoding && searchStore.isRankingLoding}>
            <Row className="deals-tabs">
                {
                    this.props.itemList.map((x, idx) => (
                        <Col key={idx} className="row" span={(24 / this.props.itemList.length)}>
                            <a className={searchStore.tradeType === x.type ? 'selected' : ''} href="javascript:void(0)"
                               onClick={() => this.handleTradeType(x.type)}>
                                <Typography.Text>{x.name}</Typography.Text>
                            </a>
                        </Col>
                    ))
                }
            </Row>
            </Spin>
        );
    }

    handleTradeType = (tradeType) => {
        const {searchStore} = this.props;
        searchStore.handleTradeType(tradeType);
    };
}

export default DealsTabs;
