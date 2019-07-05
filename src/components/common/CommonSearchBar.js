import React from 'react';
import {Button, Input} from "antd";

import "./CommonSearchBar.scss";

function CommonSearchBar(props) {
    return (
        <div className="common-search-bar">
            <div className="row">
                {
                    props.icon &&
                    <Button icon={props.icon}
                            size="large"
                            type="default"
                            onClick={props.handleButton}/>
                }
                <Input.Search
                    onClick={props.handleInput}
                    allowClear
                    ref={(input) => input && input.focus()}
                    size="large"
                    placeholder={props.placeholder}
                    value={props.value}
                    onSearch={props.handleSearch}
                    enterButton
                />
            </div>
        </div>
    );
}

export default CommonSearchBar;
