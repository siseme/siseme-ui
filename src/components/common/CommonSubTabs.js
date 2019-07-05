import React from 'react';
import {NavLink} from "react-router-dom";
import {Button, Col, Row} from "antd";

import "./CommonSubTabs.scss";

function CommonSubTabs(props) {
    return (
        <Row className="common-sub-tabs">
            {
                props.itemList.map((x, idx) => (
                    <Col key={idx} className="row" span={6}>
                        <NavLink to={x.path} activeClassName="selected">
                            <Button>{x.name}</Button>
                        </NavLink>
                    </Col>
                ))
            }
        </Row>
    );
}

export default CommonSubTabs;
