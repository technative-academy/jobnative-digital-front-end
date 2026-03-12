"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import "./DatePicker.css"

export function DatePicker() {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(undefined)

  return (
  <FieldGroup className="date-picker mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-optional"
              className="date-picker__trigger w-32 justify-between font-normal"
            >
              {date ? format(date, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="date-picker__popover w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(date) => {
                setDate(date)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
        <Input
          type="time"
          id="time-picker-optional"
          step="1"
          defaultValue="10:30:00"
          className="date-picker__time appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
