import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

interface NumberInputProps extends TextFieldProps {
  min: number;
  max: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  min,
  max,
  ...props
}) => {
  return <TextField {...props} type="number" inputProps={{ min, max }} />;
};
