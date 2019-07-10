import React from 'react';
import {Button, Col, Row} from "antd";

import "./RegionTable.scss";

const ALL = {
    name: '전체',
    code: -1
};

function RegionTable(props) {
    return (
        <Row className="region-list">
            {
                props.allRegionType &&
                <Col span={24}
                     onClick={() => props.handleClick(ALL)}>
                    <Button className={props.item.code === -1 ? 'item selected' : 'item'}>전체</Button>
                </Col>
            }
            {
                props.itemList &&
                props.itemList.map((x, idx) => (
                    <Col span={8}
                         key={idx}>
                        <Button className={props.item.name === x.name ? 'item selected' : 'item'}
                                onClick={() => props.handleClick(x)}>{x.name}</Button>
                    </Col>
                ))
            }
        </Row>
    );
}

export default RegionTable;
