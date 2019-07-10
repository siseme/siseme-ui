import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import {Button, Col, Row, Typography} from "antd";

import "./DealsTabs.scss";
import {inject, observer} from "mobx-react";

@inject('searchStore')
@observer
class DealsTabs extends Component {
    render() {
        const {searchStore} = this.props;
        return (
            <Row className="deals-tabs">
                {
                    this.props.itemList.map(x => (
                        <Col className="row" span={(24 / this.props.itemList.length)}>
                            <a className={searchStore.tradeType === x.type ? 'selected' : ''} href="javascript:void(0)"
                               onClick={() => this.handleTradeType(x.type)}>
                                <Typography.Text>{x.name}</Typography.Text>
                            </a>
                        </Col>
                    ))
                }
            </Row>
        );
    }

    handleTradeType = (tradeType) => {
        const {searchStore} = this.props;
        searchStore.handleTradeType(tradeType);
    };
}

export default DealsTabs;
