import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useController, Control } from "react-hook-form";

interface PhoneNumberInputProps {
  name: string;
  control: Control<any>;
  onValueChange: (value: { phone: string; countryCode: string }) => void;
  disabled?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  name,
  control,
  onValueChange,
  disabled = false,
}) => {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const [countryCode, setCountryCode] = useState("");

  const handleOnChange = (value: string, country: any) => {
    setCountryCode(country.dialCode);
    const phoneWithoutCountryCode = value.replace(country.dialCode, "");
    onValueChange({
      phone: phoneWithoutCountryCode,
      countryCode: country.dialCode,
    });
    onChange(value);
  };

  return (
    <div>
      <input
        type="hidden"
        id={`cCode-${name}`}
        name={`cCode-${name}`}
        value={countryCode}
      />
      <PhoneInput
        country={"in"}
        inputProps={{
          id: name,
        }}
        value={value}
        onBlur={onBlur}
        onChange={handleOnChange}
        inputStyle={{
          width: "100%",
          paddingLeft: "40px",
          padding: "24px",
          borderRadius: "0.375rem",
          border: "1.5px solid #E2E8F0",
          backgroundColor: "transparent",
          color: "#000",
          outline: "none",
          transition: "border-color 0.1s",
        }}
        containerStyle={{ width: "100%" }}
        buttonStyle={{ 
          backgroundColor: "transparent", 
          borderRight: "none",
          borderRadius: "0.375rem 0 0 0.375rem"
        }}
        dropdownStyle={{ 
          color: "#000",
          width: "300px",
          maxHeight: "300px",
          overflow: "auto"
        }}
        disabled={disabled}
        countryCodeEditable={false}
        enableSearch={false}
      />
      {error && <p className="mt-1 text-sm text-meta-1">{error.message}</p>}
    </div>
  );
};

export default PhoneNumberInput; 