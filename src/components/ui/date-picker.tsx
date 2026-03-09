"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";

type DateRangePickerProps = {
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
};

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  className,
}: DateRangePickerProps) {
  const [internalValue, setInternalValue] = React.useState<
    DateRange | undefined
  >();

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleSelect = (next: DateRange | undefined) => {
    if (!isControlled) {
      setInternalValue(next ?? undefined);
    }

    onChange?.(next ?? undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!currentValue?.from || !currentValue?.to}
          className={cn(
            "data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentValue?.from ? (
            currentValue.to ? (
              <>
                {format(currentValue.from, "LLL dd, y")} -{" "}
                {format(currentValue.to, "LLL dd, y")}
              </>
            ) : (
              format(currentValue.from, "LLL dd, y")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={currentValue?.from}
          selected={currentValue}
          onSelect={handleSelect}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
