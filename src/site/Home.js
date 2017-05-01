import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//styled-components
import {Main} from '../appStyles';

// styles
import {Flex, Box} from 'reflexbox';

// components
import Nav from './Nav';

@inject('store')
@observer
export default class Home extends Component {
  render() {
    return (
      <Flex column>
        <Nav />
        <Flex column>
          <Main mt={4} lg={12} md={12} sm={12} col={12}>
            <Box lg={4} md={4} sm={4} col={12}>One</Box>
            <Box lg={4} md={4} sm={4} col={12}>Two</Box>
            <Box lg={4} md={4} sm={4} col={12}>Three</Box>
          </Main>
        </Flex>
      </Flex>
    );
  }
}
