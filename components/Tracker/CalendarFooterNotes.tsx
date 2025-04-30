import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Notebook, NotebookText } from "lucide-react";
import TextEditor from "./TextEditor";
import { getCurrentDay } from "@/lib/utils";

interface CalendarFooterNotesProps {
  daysOfWeek: number[];
  year: number;
  month: number;
}

export default function CalendarFooterNotes({ daysOfWeek, year, month }: CalendarFooterNotesProps) {
  const [journals, setJournals] = useState<{ [key: number]: string }>({});
  const [openDay, setOpenDay] = useState<number | null>(null);

  const handleSave = () => {
    if (openDay !== null) {
      setJournals(j => ({ ...j, [openDay]: journals[openDay] || "" }));
      setOpenDay(null);
    }
  };

  // Fix scroll locking bug by resetting overflow manually
  useEffect(() => {
    if (openDay === null) {
      document.body.style.overflow = "";
    }
  }, [openDay]);

  const getFormattedDateTitle = () => {
    if (openDay === null) return "";

    const day = daysOfWeek[openDay];
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0"); // assuming month is already 1-indexed
    const weekDay = getCurrentDay(year, month, day); // Should return something like "Thu"

    return `Journal for ${weekDay}, ${formattedDay}/${formattedMonth}/${year}`;
  };

  return (
    <>
      <span className="invisible" />

      <div className="flex gap-0.5 -ml-1">
        {daysOfWeek.map((day, idx) => (
          <Button
            key={day}
            variant="ghost"
            className="p-1"
            onClick={() => setOpenDay(idx)}
          >
            <Notebook />
            {/* <NotebookText /> */}
          </Button>
        ))}
      </div>

      <Dialog open={openDay !== null} onOpenChange={open => setOpenDay(open ? openDay : null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {getFormattedDateTitle()}
            </DialogTitle>
          </DialogHeader>

          <TextEditor
            value={openDay !== null ? journals[openDay] || "" : ""}
            onChange={text =>
              setJournals(j => (openDay !== null ? { ...j, [openDay]: text } : j))
            }
          />

          <div className="flex justify-end mt-2">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
