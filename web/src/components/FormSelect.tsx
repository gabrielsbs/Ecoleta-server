import React, { ChangeEvent } from "react";

export interface FormSelectProps {
  value: string;
  name: string;
  data: string[];
  text: string;
  handleSelectedChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const FormSelect = ({
  value,
  name,
  data,
  handleSelectedChange,
}: FormSelectProps) => {
  return (
    <div className="field">
      <label htmlFor={name}>Estado (UF)</label>
      <select
        onChange={handleSelectedChange}
        value={value}
        name={name}
        id={name}
      >
        <option value="0">Selecione uma UF</option>
        {data.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
