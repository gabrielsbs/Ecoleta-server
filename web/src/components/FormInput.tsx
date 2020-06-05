import React, { ChangeEvent } from "react";

export interface FormInputProps {
  name: string;
  type: string;
  text: string;
  value: string;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput = ({
  name,
  type,
  text,
  value,
  handleInputChange,
}: FormInputProps) => {
  return (
    <div className="field">
      <label htmlFor={name}>{text}</label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default FormInput;
