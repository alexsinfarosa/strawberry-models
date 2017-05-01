import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import './Test.styl';

@inject('store')
@observer
export default class Test extends Component {
  render() {
    const arr = [1, 2, 3, 4, 'M', 'M', 'M', 5, 6];
    const results = arr.filter(e => e !== 'M');
    console.log(results);
    return <div />;
  }
}
