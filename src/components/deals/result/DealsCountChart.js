import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';
import {Icon, PageHeader, Spin, Table, Typography} from "antd";
import BillboardChart from 'react-billboardjs';
import 'react-billboardjs/lib/billboard.css';

@inject('searchStore')
@observer
class DealsCountChart extends Component {
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
            <Spin spinning={searchStore.isChartLoading}>
                <BillboardChart
                    style={{marginRight: 10}}
                    data={{
                        x: '날짜',
                        columns: searchStore.chart.countData,
                        types: {
                            '초소형(49m²이하)': 'bar',
                            '소형(49m²초과~60m²이하)': 'bar',
                            '중형(60m²초과~85m²이하)': 'bar',
                            '중대형(85m²초과~135m²이하)': 'bar',
                            '대형(135m²초과)': 'bar'
                        },
                        colors: {
                            '초소형(49m²이하)': '#ffa600',
                            '소형(49m²초과~60m²이하)': '#ff6e54',
                            '중형(60m²초과~85m²이하)': '#dd5182',
                            '중대형(85m²초과~135m²이하)': '#955196',
                            '대형(135m²초과)': '#444e86',
                            '총 거래건수': '#003f5c',
                        },
                    }}
                    axis={{
                        x: {
                            type: 'timeseries',
                            tick: {
                                count: 12,
                                format: '%Y-%m'
                            }
                        }
                    }}
                    tooltip={{
                        format: {
                            value: (value, ratio, id) => {
                                return this.numberWithCommas(value);
                            }
                        }
                    }}
                    point={{
                        r: 1,
                        focus: {
                            expand: {
                                enabled: true,
                            }
                        },
                        select: {
                            r: 2
                        }
                    }}
                    grid={{
                        y: {
                            show: true
                        },
                        x: {
                            show: true
                        }
                    }}/>
            </Spin>
        )
    }

    numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
}

export default DealsCountChart;
