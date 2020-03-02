import * as React from "react";

import { FormGroup, H5, InputGroup, Intent, Switch } from "@blueprintjs/core";
// import { IntentSelect } from "./common/intentSelect";

export interface IFormGroupExampleProps {}

export interface IFormGroupExampleState {
    disabled: boolean;
    helperText: boolean;
    inline: boolean;
    intent: Intent;
    label: boolean;
    requiredLabel: boolean;
}

export class FormGroupExample extends React.PureComponent<IFormGroupExampleProps, IFormGroupExampleState> {
    public state: IFormGroupExampleState = {
        disabled: false,
        helperText: false,
        inline: false,
        intent: Intent.NONE,
        label: true,
        requiredLabel: true,
    };

    handleDisabledChange = (event: React.FormEvent<HTMLInputElement>) => {
        const disabled = event.currentTarget.checked;
        this.setState({ disabled });
    };
    handleHelperTextChange = (event: React.FormEvent<HTMLInputElement>) => {
        const helperText = event.currentTarget.checked;
        this.setState({ helperText });
    }
    handleInlineChange = (event: React.FormEvent<HTMLInputElement>) => {
        const inline = event.currentTarget.checked;
        this.setState({ inline });
    }
    handleLabelChange = (event: React.FormEvent<HTMLInputElement>) => {
        const label = event.currentTarget.checked;
        this.setState({ label });
    }
    handleRequiredLabelChange = (event: React.FormEvent<HTMLInputElement>) => {
        const requiredLabel = event.currentTarget.checked;
        this.setState({ requiredLabel });
    }
    handleIntentChange = (intent: Intent) => {
        this.setState({ intent });
    }

    public render() {
        const { disabled, helperText, inline, intent, label, requiredLabel } = this.state;

        const options = (
            <>
                <H5>Props</H5>
                <Switch label="Disabled" checked={disabled} onChange={this.handleDisabledChange} />
                <Switch label="Inline" checked={inline} onChange={this.handleInlineChange} />
                <Switch label="Show helper text" checked={helperText} onChange={this.handleHelperTextChange} />
                <Switch label="Show label" checked={label} onChange={this.handleLabelChange} />
                <Switch label="Show label info" checked={requiredLabel} onChange={this.handleRequiredLabelChange} />
            </>
        );

        return (
            <form>
                {options}
                <FormGroup
                    disabled={disabled}
                    helperText={helperText && "Helper text with details..."}
                    inline={inline}
                    intent={intent}
                    label={label && "Label"}
                    labelFor="text-input"
                    labelInfo={requiredLabel && "(required)"}
                >
                    <InputGroup id="text-input" placeholder="Placeholder text" disabled={disabled} intent={intent} />
                </FormGroup>
                <FormGroup
                    disabled={disabled}
                    helperText={helperText && "Helper text with details..."}
                    inline={inline}
                    intent={intent}
                    label={label && "Label"}
                    labelInfo={requiredLabel && "(required)"}
                >
                    <Switch label="Engage the hyperdrive" disabled={disabled} />
                    <Switch label="Initiate thrusters" disabled={disabled} />
                </FormGroup>
            </form>
        );
    }
}