import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

//styled-components
import {NavBox, Navlink} from './styles';
import {Icon} from 'antd';

// styles
import {Flex, Box} from 'reflexbox';

// import cuLogo from '../../public/CU_LOGO_RED.gif';

@inject('store')
@observer
class Nav extends Component {
  render() {
    const isActive = {
      color: 'black',
      textDecoration: 'underline',
      textUnderlinePosition: 'under',
    };
    return (
      <Flex column>
        <Flex p={2} justify="space-between">
          <Box>
            {/* <img src={cuLogo} alt="cornell logo" /> */}
            <h2 style={{color: 'red'}}>Cornell</h2>
          </Box>
          <Box><h2><Icon type="login" /> Login</h2></Box>
        </Flex>

        <Flex p={2} m={2} justify="center">
          <Box style={{textAlign: 'center'}}>
            <h1>NEWA</h1>
            <br />
            <h2>Network for Environment and Weather Applications</h2>
          </Box>
        </Flex>

        <Flex p={2} m={2} justify="space-around">
          <NavBox p={2} lg={4} md={4} sm={4} col={12}>
            <Navlink exact to="/" activeStyle={isActive}>
              Home
            </Navlink>
          </NavBox>

          <NavBox p={2} lg={4} md={4} sm={4} col={12}>
            <Navlink to="/berry" activeStyle={isActive}>
              Berry
            </Navlink>
          </NavBox>

          <NavBox p={2} lg={4} md={4} sm={4} col={12}>
            <Navlink to="/beet" activeStyle={isActive}>
              Beet
            </Navlink>
          </NavBox>
        </Flex>

      </Flex>
    );
  }
}

export default Nav;
