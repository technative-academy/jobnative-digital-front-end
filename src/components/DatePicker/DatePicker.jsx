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

export function DatePicker({
  date,
  time,
  onChange,
  idPrefix = "date-picker",
  dateLabel = "Date",
  timeLabel = "Time",
}) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState(date)
  const [internalTime, setInternalTime] = React.useState(time ?? "10:30:00")
  const currentDate = date ?? internalDate
  const currentTime = time ?? internalTime
  const dateId = `${idPrefix}-date`
  const timeId = `${idPrefix}-time`

  React.useEffect(() => {
    if (date !== undefined) {
      setInternalDate(date)
    }
  }, [date])

  React.useEffect(() => {
    if (time !== undefined) {
      setInternalTime(time)
    }
  }, [time])

  const handleDateSelect = (nextDate) => {
    if (date === undefined) {
      setInternalDate(nextDate)
    }
    if (onChange) {
      onChange({ date: nextDate, time: currentTime })
    }
    setOpen(false)
  }

  const handleTimeChange = (event) => {
    const nextTime = event.target.value
    if (time === undefined) {
      setInternalTime(nextTime)
    }
    if (onChange) {
      onChange({ date: currentDate, time: nextTime })
    }
  }

  return (
  <FieldGroup className="date-picker mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel htmlFor={dateId}>{dateLabel}</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={dateId}
              className="date-picker__trigger w-32 justify-between font-normal"
            >
              {currentDate ? format(currentDate, "PPP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="date-picker__popover w-auto overflow-hidden p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={currentDate}
              captionLayout="dropdown"
              defaultMonth={currentDate}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor={timeId}>{timeLabel}</FieldLabel>
        <Input
          type="time"
          id={timeId}
          step="1"
          value={currentTime}
          onChange={handleTimeChange}
          className="date-picker__time appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  )
}
