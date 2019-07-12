import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import CommonDatePicker from "./CommonDatePicker";

import "./CommonDateBar.scss";
import {Button, Spin, Typography} from "antd";

@inject('searchStore')
@observer
class CommonDateBar extends Component {
    constructor(props) {
        super(props);
        this.state = {startDateOpen: false, endDateOpen: false, range: 1};
    }

    handleStartDate = (value) => {
        const {searchStore} = this.props;
        this.handleRangeDate(0);
        searchStore.handleStartDate(value);
    };

    handleStartDateOpen = () => {
        this.disableScroll();
        this.setState({startDateOpen: true});
    };

    handleStartDateCancel = () => {
        this.enableScroll();
        this.setState({startDateOpen: false});
    };

    handleEndDate = (value) => {
        const {searchStore} = this.props;
        this.handleRangeDate(0);
        searchStore.handleEndDate(value);
    };

    handleEndDateOpen = () => {
        this.disableScroll();
        this.setState({endDateOpen: true});
    };

    handleEndDateCancel = () => {
        this.enableScroll();
        this.setState({endDateOpen: false});
    };

    handleRangeDate = (range) => {
        const {searchStore} = this.props;
        this.setState({range: range});
        searchStore.handleRangeDate(range);
    };

    disableScroll = () => {
        let rootElem = document.getElementById('root');
        rootElem.style.position = 'fixed';
        rootElem.style.overflowY = 'scroll';
        rootElem.style.width = '100%';
    };

    enableScroll = () => {
        let rootElem = document.getElementById('root');
        rootElem.style.position = '';
        rootElem.style.overflowY = '';
        rootElem.style.width = '';
    };

    render() {
        const {searchStore} = this.props;
        return (
            <Spin spinning={searchStore.isDataLoding && searchStore.isRankingLoding}>
                <div className="common-date-bar">
                    <div style={{marginRight: 14}}>
                        <Button.Group>
                            <Button className="date-button" size="medium"
                                    onClick={this.handleStartDateOpen}>{searchStore.startDate.format('YYYY.MM')}</Button>
                            <Button className="date-button" size="medium"
                                    onClick={this.handleEndDateOpen}>{searchStore.endDate.format('YYYY.MM')}</Button>
                        </Button.Group>
                        <CommonDatePicker value={searchStore.startDate.toDate()}
                                          cancel={this.handleStartDateCancel}
                                          isOpen={this.state.startDateOpen}
                                          handleDate={this.handleStartDate}/>
                        <CommonDatePicker value={searchStore.endDate.toDate()}
                                          cancel={this.handleEndDateCancel}
                                          isOpen={this.state.endDateOpen}
                                          handleDate={searchStore.handleEndDate}/>
                    </div>
                    <div className="trade-select">
                        <Typography.Text type="secondary"
                                         className={searchStore.tradeType === 'trade' ? 'button selected' : 'button'}
                                         onClick={() => this.handleTradeType('trade')}>실거래</Typography.Text>
                        <Typography.Text type="secondary">|</Typography.Text>
                        <Typography.Text type="secondary"
                                         className={searchStore.tradeType === 'ticket' ? 'button selected' : 'button'}
                                         onClick={() => this.handleTradeType('ticket')}>분양권</Typography.Text>
                        <Typography.Text type="secondary">|</Typography.Text>
                        <Typography.Text type="secondary"
                                         className={searchStore.tradeType === 'rent' ? 'button selected' : 'button'}
                                         onClick={() => this.handleTradeType('rent')}>전월세</Typography.Text>
                    </div>
                </div>
            </Spin>
        )
    }

    handleTradeType = (tradeType) => {
        const {searchStore} = this.props;
        searchStore.handleTradeType(tradeType);
    };
}

export default CommonDateBar;