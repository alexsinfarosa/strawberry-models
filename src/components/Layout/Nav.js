import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

@inject("store")
@observer
class Nav extends Component {
  state = {
    current: "mail"
  };
  handleClick = e => {
    console.log("click ", e);
    this.setState({
      current: e.key
    });
  };
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="mail">
          <Icon type="mail" />Weather Data
        </Menu.Item>

        <SubMenu title={<span><Icon type="setting" />Pest Forecasts</span>}>
          <MenuItemGroup title="Apple">
            <Menu.Item key="setting:1">Apple Diseases</Menu.Item>
            <Menu.Item key="setting:2">Apple Insects</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Onion">
            <Menu.Item key="setting:3">Onion Diseases</Menu.Item>
            <Menu.Item key="setting:4">Onion Maggot</Menu.Item>
          </MenuItemGroup>
          <MenuItemGroup title="Berry">
            <Menu.Item key="setting:5">Berry Diseases</Menu.Item>

          </MenuItemGroup>
        </SubMenu>
        <Menu.Item key="empty">
          Crop Management
        </Menu.Item>
      </Menu>
    );
  }
}

export default Nav;
