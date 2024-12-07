"use client";

import * as React from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import DateIcon from "../icons/DateIcon";
import { Input } from "./input";

export default function DatePicker() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="w-full">
      <Popover>
        <PopoverTrigger
          asChild
          disabled
          className="disabled:bg-peerlistHoverBackground p-2"
        >
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal shadow-sm",
              !date && "text-muted-foreground"
            )}
          >
            <Input
              disabled
              variant={"other"}
              className=" font-normal"
              value={date ? format(date, "MM-dd-yyyy") : "MM-DD-YYYY"}
              type="text"
            />
            <DateIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <PopoverClose>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverClose>
        </PopoverContent>
      </Popover>
    </div>
  );
}
