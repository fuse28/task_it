import React from "react";

import Select from "react-select";
import AsyncSelect from "react-select/async";

export const MultiSelect = ({
  options,
  value,
  onValueChange,
  placeholder,
}: {
  options: any;
  value: any;
  onValueChange: any;
  placeholder: string;
}) => {
  return (
    <div>
      <Select
        isMulti
        options={options}
        value={value}
        onChange={onValueChange}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
};
