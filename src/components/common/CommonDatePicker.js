import React, {Component} from 'react';
import DatePicker from 'react-mobile-datepicker';

const MONTH_ITEM = {
    '1': '1월',
    '2': '2월',
    '3': '3월',
    '4': '4월',
    '5': '5월',
    '6': '6월',
    '7': '7월',
    '8': '8월',
    '9': '9월',
    '10': '10월',
    '11': '11월',
    '12': '12월',
};

const dateConfig = {
    'year': {
        format: 'YYYY',
        caption: 'Year',
        step: 1,
    },
    'month': {
        format: value => MONTH_ITEM[value.getMonth() + 1],
        caption: 'Mon',
        step: 1,
    }
};

class CommonDatePicker extends Component {
    handleDate = (e) => {
        this.props.handleDate(e);
        this.props.cancel();
    };

    render() {
        return (
            <div style={{width: '48%'}}>
                {/*
              <TextField
                style={{height: '40px'}}
                disabled
                fullWidth={true}
                label={this.props.label ? this.props.label : ''}
                value={moment(this.props.date).format('YYYY년 MM월')}
                onClick={this.handleClick}
                margin="normal"
                variant="standard"
              />
*/}
                <DatePicker
                    style={{zIndex: '9999 !important'}}
                    value={this.props.value}
                    isOpen={this.props.isOpen}
                    dateConfig={dateConfig}
                    confirmText={'확인'}
                    cancelText={'취소'}
                    headerFormat={'YYYY.MM'}
                    theme={'ios'}
                    max={new Date()}
                    min={new Date(2005, 1, 1)}
                    onSelect={this.handleDate}
                    onCancel={this.props.cancel}/>
            </div>
        );
    }
}

export default CommonDatePicker;
