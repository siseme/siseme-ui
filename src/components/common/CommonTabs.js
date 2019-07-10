import React from 'react';
import {NavLink} from "react-router-dom";
import {Button, Col, Row} from "antd";

import "./CommonTabs.scss";

function CommonTabs(props) {
    return (
        <Row className="common-tabs">
            {
                props.itemList.map(x => (
                    <Col className="row" span={(24/props.itemList.length)}>
                        <NavLink exact to={x.path} activeClassName="selected">
                            <Button>{x.name}</Button>
                        </NavLink>
                    </Col>
                ))
            }
        </Row>
    );
}

export default CommonTabs;
