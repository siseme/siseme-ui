import React, {Component} from 'react';
import {inject, observer} from 'mobx-react/index';

@observer
class Coupang extends Component {
    render() {
        return (
          <div>
            <iframe width="100%" height="100%" frameBorder="0" src="https://sise.me/ad"/>
          </div>
        );
    }
}

export default Coupang;
