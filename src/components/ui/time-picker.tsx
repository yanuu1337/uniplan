"use client";

import * as React from "react";
import { format } from "date-fns";

import { Input } from "#/components/ui/input";

type TimePickerProps = {
  id?: string;
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
};

export function TimePicker({
  id,
  value,
  onChange,
  disabled,
  className,
}: TimePickerProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = event.target.value;

    if (!timeValue) {
      onChange?.(undefined);
      return;
    }

    const [hoursString, minutesString] = timeValue.split(":");
    const hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return;
    }

    const base = value ?? new Date();
    const next = new Date(base);
    next.setHours(hours, minutes, 0, 0);

    onChange?.(next);
  };

  return (
    <Input
      id={id}
      type="time"
      value={value ? format(value, "HH:mm") : ""}
      onChange={handleChange}
      disabled={disabled}
      className={className}
    />
  );
}

