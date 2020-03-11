import * as React from "react";

import {
  FormGroup,
  H1,
  H3,
  H4,
  InputGroup,
  Intent,
  Switch,
  Divider,
  Radio,
  RadioGroup,
  Button,
  MenuItem
} from "@blueprintjs/core";

import { Select, ItemRenderer, ItemPredicate } from "@blueprintjs/select";

import "./Form.css";

export interface IFormGroupExampleProps {}

export interface IFormGroupExampleState {
  disabled: boolean;
  helperText: boolean;
  inline: boolean;
  intent: Intent;
  label: boolean;
  requiredLabel: boolean;
  ticketStatus: string;
}

interface SavedSearch {
  name: string;
  value: string;
}
const SavedSearches = {
  items: [
    { name: "Great Search I saved", value: "123" },
    { name: "Tickets I Luv", value: "1234" }
  ]
};
// Select<T> is a generic component to work with your data types.
// In TypeScript, you must first obtain a non-generic reference:
const SavedSearchSelect = Select.ofType<SavedSearch>();

const filterSavedSearch: ItemPredicate<SavedSearch> = (query, savedSearch) => {
  return savedSearch.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
};

const renderSavedSearch: ItemRenderer<SavedSearch> = (
  savedSearch,
  { handleClick, modifiers }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  return (
    <MenuItem
      active={modifiers.active}
      key={savedSearch.value}
      onClick={handleClick}
      text={savedSearch.name}
    />
  );
};

export class FormGroupExample extends React.PureComponent<
  IFormGroupExampleProps,
  IFormGroupExampleState
> {
  public state: IFormGroupExampleState = {
    disabled: false,
    helperText: false,
    inline: false,
    intent: Intent.NONE,
    label: true,
    requiredLabel: true,
    ticketStatus: "all"
  };

  handleDisabledChange = (event: React.FormEvent<HTMLInputElement>) => {
    const disabled = event.currentTarget.checked;
    this.setState({ disabled });
  };
  handleHelperTextChange = (event: React.FormEvent<HTMLInputElement>) => {
    const helperText = event.currentTarget.checked;
    this.setState({ helperText });
  };
  handleInlineChange = (event: React.FormEvent<HTMLInputElement>) => {
    const inline = event.currentTarget.checked;
    this.setState({ inline });
  };
  handleLabelChange = (event: React.FormEvent<HTMLInputElement>) => {
    const label = event.currentTarget.checked;
    this.setState({ label });
  };
  handleRequiredLabelChange = (event: React.FormEvent<HTMLInputElement>) => {
    const requiredLabel = event.currentTarget.checked;
    this.setState({ requiredLabel });
  };
  handleIntentChange = (intent: Intent) => {
    this.setState({ intent });
  };
  handleValueChange = (value: number) => {
    console.log(value);
  };
  handleTicketStatusChange = (event: React.FormEvent<HTMLInputElement>) => {
    const ticketStatus = event.currentTarget.value;
    this.setState({ ticketStatus });
  };
  handleSavedSearchChange = (item: SavedSearch) => {
    console.log(item);
  };

  public render() {
    const {
      disabled,
      helperText,
      inline,
      intent,
      label,
      requiredLabel
    } = this.state;

    const options = (
      <>
        <Switch
          label="Disabled"
          checked={disabled}
          onChange={this.handleDisabledChange}
        />
        <Switch
          label="Inline"
          checked={inline}
          onChange={this.handleInlineChange}
        />
        <Switch
          label="Show helper text"
          checked={helperText}
          onChange={this.handleHelperTextChange}
        />
        <Switch
          label="Show label"
          checked={label}
          onChange={this.handleLabelChange}
        />
        <Switch
          label="Show label info"
          checked={requiredLabel}
          onChange={this.handleRequiredLabelChange}
        />
      </>
    );

    return (
      <div>
        <div className="section">
        <FormGroup label={"Form Control Options"}>{options}</FormGroup>
        </div>
        <form>
          <H1>Send Grading Assignments</H1>
          <Divider />
          <div className="form-section">
            <H3>Describe the Automation</H3>
            <FormGroup
              disabled={disabled}
              helperText={helperText && "Helper text with details..."}
              inline={inline}
              intent={intent}
              label={label && "Automation Name"}
              labelFor="text-input"
              labelInfo={requiredLabel && "(required)"}
            >
              <InputGroup
                id="text-input"
                placeholder="Placeholder text"
                disabled={disabled}
                intent={intent}
              />
            </FormGroup>
          </div>
          <Divider />
          <div className="form-section">
            <H3>Choose Tickets</H3>
            <H4>Find Tickets</H4>
            <RadioGroup
              label="Ticket Status"
              onChange={this.handleTicketStatusChange}
              selectedValue={this.state.ticketStatus}
              inline={true}
              className={"radio-chips"}
            >
              {["all", "graded", "created", "updated", "solved"].map(status => {
                const checked = status === this.state.ticketStatus;
                const classes = checked ? "radio-chip checked" : "radio-chip";
                return (
                  <Radio
                    key={status}
                    label={status}
                    value={status}
                    className={classes}
                  />
                );
              })}
            </RadioGroup>
          </div>
          <Divider />
          <div className="form-section">
            <H3>Choose Tickets</H3>
            <H4>Find Tickets</H4>
            <SavedSearchSelect
              items={SavedSearches.items}
              itemPredicate={filterSavedSearch}
              itemRenderer={renderSavedSearch}
              noResults={<MenuItem disabled={true} text="No results." />}
              onItemSelect={this.handleSavedSearchChange}
            >
              {/* children become the popover target; render value here */}
              <Button
                text={"Select saved searches"}
                rightIcon="double-caret-vertical"
                minimal={true}
                className={"dropdown-select-btn"}
              />
            </SavedSearchSelect>
          </div>
          <Divider />
        </form>
      </div>
    );
  }
}
