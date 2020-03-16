import * as React from "react";

import {
  FormGroup,
  H1,
  H2,
  H3,
  InputGroup,
  Divider,
  Radio,
  RadioGroup,
  Button,
  MenuItem,
  ControlGroup,
  Checkbox,
  NumericInput,
  Tag
} from "@blueprintjs/core";

import { Select, ItemRenderer, ItemPredicate } from "@blueprintjs/select";
import { DateInput, TimePrecision } from "@blueprintjs/datetime";

import "./Form.css";

export interface FormGroupExampleState {
  ticketStatus: string;
  savedSearchFilters: SavedSearch[];
  assignmentType: string;
  distributionType: string;
  isSetSchedule: boolean;
  isRecurring: boolean;
  scheduleFrequency: number;
  scheduleInterval: string;
}

interface SavedSearch {
  name: string;
  value: string;
  disabled?: boolean;
}
const SavedSearches = {
  items: [
    { name: "Great Search I saved", value: "1", disabled: false },
    { name: "Tickets I Love", value: "12", disabled: false },
    { name: "Find What I want!", value: "123", disabled: false },
    { name: "Rude Dude", value: "1234", disabled: false },
    { name: "Do people give their dogs middle names?", value: "12345", disabled: false },
    { name: "Finneus Maximus", value: "123456", disabled: false },
    { name: "Tickets I don't Love", value: "1234567", disabled: false },
  ]
};
const SavedSearchSelect = Select.ofType<SavedSearch>();

interface ScheduleInterval {
  name: string;
  value: "day" | "week" | "month";
}
const ScheduleIntervalSelect = Select.ofType<ScheduleInterval>();

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
      disabled={savedSearch.disabled}
    />
  );
};

export class FormGroupExample extends React.PureComponent<
  {},
  FormGroupExampleState
> {
  public state: FormGroupExampleState = {
    ticketStatus: "all",
    savedSearchFilters: [],
    assignmentType: "random",
    distributionType: "even",
    isSetSchedule: false,
    isRecurring: false,
    scheduleFrequency: null,
    scheduleInterval: null
  };

  // form event handlers
  handleValueChange = (value: number) => {
    console.log(value);
  };
  handleTicketStatusChange = (event: React.FormEvent<HTMLInputElement>) => {
    const ticketStatus = event.currentTarget.value;
    this.setState({ ticketStatus });
  };
  handleAssignmentTypeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const assignmentType = event.currentTarget.value;
    this.setState({ assignmentType });
  };
  handleDistributionTypeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const distributionType = event.currentTarget.value;
    this.setState({ distributionType });
  };
  handleAddSavedSearchFilter = (search: SavedSearch) => {
    this.setState(prevState => {
      const { savedSearchFilters } = prevState;
      return { savedSearchFilters: [...savedSearchFilters, search] };
    });
  };
  handleRemoveSavedSearchFilter = (search: SavedSearch) => {
    const { savedSearchFilters } = this.state;
    this.setState({
      savedSearchFilters: savedSearchFilters.filter(
        s => s.value !== search.value
      )
    });
  };
  handleCreateSearch = () => {
    console.log("create saved search");
  };
  handleIsSetScheduleChange = () => {
    const isSetSchedule = !this.state.isSetSchedule;
    this.setState({ isSetSchedule });
  };
  handleScheduleStartDateChange = (date: Date) => {
    console.log(date);
  };
  handleIsRecurringChange = () => {
    const isRecurring = !this.state.isRecurring;
    this.setState({ isRecurring });
  };
  handleScheduleIntervalChange = (interval: string) => {
    this.setState({ scheduleInterval: interval });
  };
  handleScheduleFrequencyChange = (frequency: number) => {
    this.setState({ scheduleFrequency: frequency });
  };

  getSavedSearchFilters = () => {
    const savedSearches = SavedSearches.items;
    const { savedSearchFilters } = this.state;
    const filterValues = savedSearchFilters.map(s => s.value);
      savedSearches.forEach(search => {
        if (filterValues.includes(search.value)) {
          search.disabled = true;
        } else {
          search.disabled = false;
        }
      });
    
    return savedSearches;
  };
  getScheduleFrequencyMax = () => {
    const { scheduleInterval } = this.state;
    let max = 1;
    switch (scheduleInterval) {
      case "day":
        max = 364;
        break;
      case "week":
        max = 52;
        break;
      case "month":
        max = 12;
        break;
    }
    return max;
  };

  public render() {

    const maxScheduleFrequency: number = this.getScheduleFrequencyMax();

    return (
      <div>
        <form>
          <H1 className="form-header">Send Grading Assignments</H1>
          <div className="form-section">
            <H2>Describe the Automation</H2>
            <FormGroup
              label="Automation Name"
              labelFor="text-input"
              labelInfo={"*"}
            >
              <InputGroup
                id="text-input"
                placeholder="Name this automation"
                large={true}
              />
            </FormGroup>
          </div>
          <Divider />
          <div className="form-section">
            <H2>Choose Tickets</H2>
            <div className="form-subsection">
              <H3>Find Tickets</H3>
              <RadioGroup
                label="Ticket Status"
                onChange={this.handleTicketStatusChange}
                selectedValue={this.state.ticketStatus}
                inline={true}
                className="radio-chips"
              >
                {["all", "graded", "created", "updated", "solved"].map(
                  status => {
                    const checked = status === this.state.ticketStatus;
                    const classes = checked
                      ? "radio-chip checked"
                      : "radio-chip";
                    return (
                      <Radio
                        key={status}
                        label={status}
                        value={status}
                        className={classes}
                      />
                    );
                  }
                )}
              </RadioGroup>
            </div>
            <div className="form-subsection">
              <H3>Refine Ticket Results</H3>
              <ControlGroup>
                <SavedSearchSelect
                  items={this.getSavedSearchFilters()}
                  itemPredicate={filterSavedSearch}
                  itemRenderer={renderSavedSearch}
                  noResults={<MenuItem disabled={true} text="No results." />}
                  onItemSelect={this.handleAddSavedSearchFilter}
                  className="bp3-large"
                >
                  <Button
                    text={"Select saved searches"}
                    rightIcon="double-caret-vertical"
                    minimal={true}
                    className={"dropdown-select-btn"}
                  />
                </SavedSearchSelect>
                <span className="spacer-text">or</span>
                <Button icon="add" onClick={this.handleCreateSearch} className="bkg-lightgrey" minimal={true} large={true}>
                  Create a new search
                </Button>
              </ControlGroup>
              {this.state.savedSearchFilters.length > 0 && (
              <div className="multi-tag-container">
                {this.state.savedSearchFilters.map(search => {
                  return (
                    <Tag
                      key={search.value}
                      onRemove={() => {
                        this.handleRemoveSavedSearchFilter(search);
                      }}
                      large={true}
                      minimal={true}
                    >
                      {search.name}
                    </Tag>
                  );
                })}
              </div>
              )}
            </div>
          </div>
          <Divider />
          <div className="form-section">
            <H2>Choose Tickets</H2>
            <div className="form-subsection">
              <H3>Assign Tickets</H3>
              <RadioGroup
                label="Assignment Type"
                onChange={this.handleAssignmentTypeChange}
                selectedValue={this.state.assignmentType}
                inline={true}
                className={"radio-chips"}
              >
                {["manual", "random"].map(assignmentType => {
                  const checked = assignmentType === this.state.assignmentType;
                  const classes = checked ? "radio-chip checked" : "radio-chip";
                  return (
                    <Radio
                      key={assignmentType}
                      label={assignmentType}
                      value={assignmentType}
                      className={classes}
                    />
                  );
                })}
              </RadioGroup>
            </div>
            <div className="form-subsection">
              <RadioGroup
                label="Distribution Type"
                onChange={this.handleDistributionTypeChange}
                selectedValue={this.state.distributionType}
                inline={true}
                className={"radio-chips"}
              >
                {[{name: "evenly", value: 'even'}, {name: "by percent", value: 'percent'}].map(({name, value}) => {
                  const checked =
                    value === this.state.distributionType;
                  const classes = checked ? "radio-chip checked" : "radio-chip";
                  return (
                    <Radio
                      key={value}
                      label={name}
                      value={value}
                      className={classes}
                    />
                  );
                })}
              </RadioGroup>
            </div>
          </div>
          <Divider />
          <div className="form-section">
            <H2>Set Schedule</H2>
            <div className="form-subsection">
              <span className="input-title">Frequency</span>
              <Checkbox
                checked={!this.state.isSetSchedule}
                label="No schedule (manually trigger)"
                onChange={this.handleIsSetScheduleChange}
              />
            </div>
            {this.state.isSetSchedule && (
              <div className="form-subsection">
                <span className="input-title">Starting On</span>
                <DateInput
                  onChange={this.handleScheduleStartDateChange}
                  timePrecision={TimePrecision.MINUTE}
                  formatDate={date => date.toLocaleString()}
                  parseDate={str => new Date(str)}
                  minDate={new Date()}
                  timePickerProps={{useAmPm: true}}
                  placeholder={"Select a date"}
                />
              </div>
            )}
            {this.state.isSetSchedule && (
              <div>
                <div className="form-subsection">
                  <Checkbox
                    checked={this.state.isRecurring}
                    label="Run Every"
                    onChange={this.handleIsRecurringChange}
                  />
                  {this.state.isRecurring && (
                    <ControlGroup>
                      <NumericInput
                        min={1}
                        max={maxScheduleFrequency}
                        onValueChange={this.handleScheduleFrequencyChange}
                        clampValueOnBlur={true}
                        buttonPosition="none"
                      />
                      <ScheduleIntervalSelect
                        items={[
                          { name: "day(s)", value: "day" },
                          { name: "week(s)", value: "week" },
                          { name: "month(s)", value: "month" }
                        ]}
                        itemRenderer={renderSavedSearch}
                        onItemSelect={({ value }) =>
                          this.handleScheduleIntervalChange(value)
                        }
                      >
                        <Button
                          text={
                            this.state.scheduleInterval
                              ? `${this.state.scheduleInterval}(s)`
                              : "Select time interval"
                          }
                          rightIcon="double-caret-vertical"
                          minimal={true}
                          className={"dropdown-select-btn"}
                        />
                      </ScheduleIntervalSelect>
                    </ControlGroup>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}
