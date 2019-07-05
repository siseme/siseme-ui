import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'mobx-react';
import {BrowserRouter} from 'react-router-dom';

import RootStore from "./stores";

const root = new RootStore(); // *** 루트 스토어 생성

ReactDOM.render(
    <Provider {...root}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>, document.getElementById('root'));
