import * as React from "react";
import {
  Alignment,
  AnchorButton,
  Classes,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider, Button, Menu, MenuItem, Popover, Position
} from "@blueprintjs/core";

export interface NavigationProps {}

export class Navigation extends React.PureComponent<NavigationProps> {
  public render() {
    const dropdownMenu = (
      <Menu>
          <MenuItem icon="graph" text="Graph" />
      </Menu>
    );

    return (
      <Navbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>MaestroQA</NavbarHeading>
          <NavbarDivider />
            <AnchorButton href="/home">Home</AnchorButton>
            <AnchorButton href="/home">Reporting</AnchorButton>
            <AnchorButton href="/home">Coaching</AnchorButton>
            <AnchorButton href="/home">Tickets</AnchorButton>
            <AnchorButton href="/home">Ticket Reviews</AnchorButton>
            <AnchorButton href="/home">Exports</AnchorButton>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <AnchorButton href="/home">Notifications</AnchorButton>
          <AnchorButton href="/home">What's New</AnchorButton>
          <AnchorButton href="/home">Help</AnchorButton>
          <Popover content={dropdownMenu} position={Position.BOTTOM} minimal={true}>
            <Button icon="settings" text="Suzanmsucro" />
          </Popover>
        </NavbarGroup>
      </Navbar>
    );
  }
}
