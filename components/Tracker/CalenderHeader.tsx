import { getCurrentDay, getMonthFromIndex } from '@/lib/utils';
import React from 'react'
import { Button } from '../ui/button';
import { Separator } from '@radix-ui/react-separator';

const TODAY = new Date().getDate();

const CalendarHeader = ({
  year,
  month,
  currentWeek,
  onPrevWeek,
  onNextWeek,
  canGoPrev,
  canGoNext,
  currentWeekIndex
}: {
  year: number;
  month: number;
  currentWeek: number[];
  onPrevWeek: () => void;
  onNextWeek: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  currentWeekIndex: number;
}) => (
  <>
    <div className="col-span-full flex justify-between items-center mb-2">
      <Button onClick={onPrevWeek} disabled={!canGoPrev} className='cursor-pointer'>←</Button>
      <div className="text-lg font-bold cursor-default">{`${getMonthFromIndex(month)} ${currentWeek[0]}-${currentWeek[currentWeek.length-1]}`}</div>
      <Button onClick={onNextWeek} disabled={!canGoNext} className='cursor-pointer'>→</Button>
    </div>

    <Separator className="" />

    {currentWeek.map((day) => (
      <div
        key={day}
        className={`text-center cursor-default text-sm py-1 rounded flex flex-col items-center justify-center ${TODAY === day && 'bg-black/80 text-white'}`}
      >
        <div>{day}</div>
        <hr className='my-0.5 h-[1px] w-full bg-muted'/>
        <div>{getCurrentDay(year, month, day)}</div>
      </div>
    ))}
  </>
);

export default CalendarHeader;