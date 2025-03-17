import React from "react";
import { Control, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";

import { formSchema } from "./TransformationForm";

// Infer the schema type
type FormSchemaType = z.infer<typeof formSchema>;

type CustomFieldProps = {
  control: Control<FormSchemaType> | undefined;
  render: (props: { field: ControllerRenderProps<FormSchemaType, keyof FormSchemaType> }) => React.ReactNode;
  name: keyof FormSchemaType;
  formLabel?: string;
  className?: string;
};

export const CustomField = ({
  control,
  render,
  name,
  formLabel,
  className,
}: CustomFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
