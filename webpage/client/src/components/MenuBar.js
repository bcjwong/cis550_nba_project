import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/">CIS 550 NBA</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/players">
                Players
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/teams" >
                Teams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/games" >
                Games
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
