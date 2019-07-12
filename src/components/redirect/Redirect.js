import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import moment from "moment";

@inject('searchStore')
@observer
class Redirect extends Component {
    constructor (props) {
        super(props);
        this.redirect();
    };

    render() {
        return (
            <div>
                Loading...
            </div>
        )
    }

    redirect = () => {
        const {searchStore, history, location} = this.props;
        let pathname = location.pathname.replace('/r/', '');
        let regionFullName = pathname.substring(0, pathname.indexOf('_'));
        let tradeType = pathname.substring(pathname.indexOf('_')+1, pathname.indexOf('('));
        let tradeTypeName = 'trade';
        if(tradeType === '분양권') {
            tradeTypeName = 'ticket';
        }
        else if(tradeType === '전월세') {
            tradeTypeName = 'rent';
        }
        let dateParams = pathname.substring(pathname.indexOf('(')+1, pathname.indexOf(')'));
        let startDate = moment(dateParams.substring(0, dateParams.indexOf('~')), 'YYYY년MM월');
        let endDate = moment(dateParams.substring(dateParams.indexOf('~')+1, dateParams.length), 'YYYY년MM월');
        searchStore.getRegionByFullName(regionFullName);
        searchStore.handleStartDate(startDate);
        searchStore.handleEndDate(endDate);
        searchStore.handleTradeType(tradeTypeName);
        history.push('/');
    };
}

export default Redirect;
