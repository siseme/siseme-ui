import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

import CommonDatePicker from "./CommonDatePicker";

import "./CommonDateBar.scss";
import {Button, Typography} from "antd";

@inject('searchStore')
@observer
class CommonDateBar extends Component {
    constructor(props) {
        super(props);
        this.state = {startDateOpen: false, endDateOpen: false};
    }

    handleStartDateOpen = () => {
        this.setState({startDateOpen: true});
    };

    handleStartDateCancel = () => {
        this.setState({startDateOpen: false});
    };

    handleEndDateOpen = () => {
        this.setState({endDateOpen: true});
    };

    handleEndDateCancel = () => {
        this.setState({endDateOpen: false});
    };

    render() {
        const {searchStore} = this.props;
        return (
            <div className="common-date-bar">
                <div>
                    <Button onClick={() => searchStore.handleRangeDate(1)}>1년</Button>
                    <Button onClick={() => searchStore.handleRangeDate(3)}>3년</Button>
                    <Button onClick={() => searchStore.handleRangeDate(5)}>5년</Button>
                </div>
                <div>
                    <Button onClick={this.handleStartDateOpen}>{searchStore.startDate.format('YYYY.MM')}</Button>
                    <Typography.Text className="split">-</Typography.Text>
                    <Button onClick={this.handleEndDateOpen}>{searchStore.endDate.format('YYYY.MM')}</Button>
                    <CommonDatePicker value={searchStore.startDate.toDate()}
                                      cancel={this.handleStartDateCancel}
                                      isOpen={this.state.startDateOpen}
                                      handleDate={searchStore.handleStartDate}/>
                    <CommonDatePicker value={searchStore.endDate.toDate()}
                                      cancel={this.handleEndDateCancel}
                                      isOpen={this.state.endDateOpen}
                                      handleDate={searchStore.handleEndDate}/>
                </div>
            </div>
        )
    }
}

export default CommonDateBar;