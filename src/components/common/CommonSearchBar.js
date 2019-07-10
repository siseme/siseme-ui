import React from 'react';
import {Button, Input} from "antd";

import "./CommonSearchBar.scss";

function CommonSearchBar(props) {
    return (
        <div className="common-search-bar">
            <div className="row">
                {
                    props.icon ?
                    <Button className="back-btn"
                            icon={props.icon}
                            size="large"
                            type="default"
                            onClick={props.handleButton}/>
                            :
                    <Button className="back-btn"
                            icon="home"
                            size="large"
                            type="default"
                            onClick={props.handleButton}/>
                }
                <Input.Search
                    className='input-search'
                    onClick={props.handleInput}
                    size="large"
                    placeholder={props.placeholder}
                    value={props.value}
                    onSearch={props.handleSearch}
                    enterButton="검색"
                />
            </div>
        </div>
    );
}

export default CommonSearchBar;
