import React from "react";

import Select, { type MultiValue } from "react-select";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export const MultiSelect = ({
  options,
  value,
  onValueChange,
  placeholder,
}: {
  options: MultiSelectOption[];
  value: MultiValue<MultiSelectOption>;
  onValueChange: (value: MultiValue<MultiSelectOption>) => void;
  placeholder: string;
}) => {
  return (
    <div>
      <Select
        isMulti
        unstyled
        options={options}
        value={value}
        onChange={onValueChange}
        placeholder={placeholder}
        classNamePrefix="select"
        classNames={{
          control: ({ isFocused }) =>
            `min-h-9 rounded-md border bg-transparent px-1 text-sm shadow-xs ${
              isFocused ? "border-ring ring-[3px] ring-ring/50" : "border-input"
            }`,
          placeholder: () => "text-muted-foreground px-1",
          input: () => "text-foreground px-1",
          valueContainer: () => "gap-1 py-0.5",
          multiValue: () => "bg-secondary rounded-sm items-center overflow-hidden",
          multiValueLabel: () => "text-secondary-foreground px-1.5 py-0.5 text-xs",
          multiValueRemove: () =>
            "text-secondary-foreground hover:bg-destructive/20 hover:text-destructive px-1",
          menu: () => "mt-1 rounded-md border bg-popover text-popover-foreground shadow-md z-50",
          menuList: () => "p-1",
          option: ({ isFocused, isSelected }) =>
            `rounded-sm px-2 py-1.5 text-sm cursor-pointer ${
              isSelected
                ? "bg-primary text-primary-foreground"
                : isFocused
                ? "bg-accent text-accent-foreground"
                : ""
            }`,
          noOptionsMessage: () => "text-muted-foreground text-sm py-2",
          indicatorSeparator: () => "bg-border",
          dropdownIndicator: () => "text-muted-foreground px-1",
          clearIndicator: () => "text-muted-foreground px-1",
        }}
      />
    </div>
  );
};
