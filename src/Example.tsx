import * as React from "react";
import { Card } from "@blueprintjs/core";

export interface ExampleProps {
  header: string;
}

export class Example extends React.PureComponent<ExampleProps> {
  public render() {
    return (
      <Card className="example-card">
        <div className="example-header">{this.props.header}</div>
        {this.props.children}
      </Card>
    );
  }
}