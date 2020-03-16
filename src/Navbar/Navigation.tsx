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
          <MenuItem icon="graph" text="Graph" />
          <MenuItem icon="graph" text="Graph" />
          <MenuItem icon="graph" text="Graph" />
          <MenuItem icon="graph" text="Graph" />
      </Menu>
    );

    return (
      <Navbar className={Classes.DARK}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>MaestroQA</NavbarHeading>
          <NavbarDivider />
            <AnchorButton minimal={true} href="#">Home</AnchorButton>
            <AnchorButton minimal={true} href="#">Reporting</AnchorButton>
            <AnchorButton minimal={true} href="#">Coaching</AnchorButton>
            <AnchorButton minimal={true} href="#">Tickets</AnchorButton>
            <AnchorButton minimal={true} href="#">Ticket Reviews</AnchorButton>
            <AnchorButton minimal={true} href="#">Exports</AnchorButton>
        </NavbarGroup>
        <NavbarGroup align={Alignment.RIGHT}>
          <AnchorButton minimal={true} href="#">Notifications</AnchorButton>
          <AnchorButton minimal={true} href="#">What's New</AnchorButton>
          <AnchorButton minimal={true} href="#">Help</AnchorButton>
          <Popover content={dropdownMenu} position={Position.BOTTOM} minimal={true}>
            <Button rightIcon="settings" text="Suzanmsucro" minimal={true} />
          </Popover>
        </NavbarGroup>
      </Navbar>
    );
  }
}
