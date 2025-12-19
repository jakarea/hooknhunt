import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date | string
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  minDate?: Date | string
}

export function DatePicker({ value, onChange, placeholder = "Pick date", className, minDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? (typeof value === 'string' ? (value ? new Date(value) : undefined) : value) : undefined
  )

  const minDateObj = minDate ? (typeof minDate === 'string' ? new Date(minDate) : minDate) : undefined

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    onChange(selectedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-8 w-full justify-start text-left font-normal px-2",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-1 h-3 w-3 shrink-0" />
          <span className="text-xs truncate">
            {date ? format(date, "MMM dd") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          fromDate={minDateObj}
        />
      </PopoverContent>
    </Popover>
  )
}
