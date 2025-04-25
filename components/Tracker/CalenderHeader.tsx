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
      <Button onClick={onPrevWeek} disabled={!canGoPrev}>←</Button>
      <div className="text-lg font-bold">{`${getMonthFromIndex(month)} ${currentWeek[0]}-${currentWeek[currentWeek.length-1]}`}</div>
      <Button onClick={onNextWeek} disabled={!canGoNext}>→</Button>
    </div>

    <Separator className='bg-black text-black'/>

    {currentWeek.map((day) => (
      <div
        key={day}
        className={`text-center text-sm h-11 flex flex-col items-center justify-center ${TODAY === day && 'bg-black/80 text-white'}`}
      >
        <div>{day}</div>
        {/* // ! Add separator */}
        <Separator className='bg-black text-black'/>
        <div>{getCurrentDay(year, month, day)}</div>
      </div>
    ))}
  </>
);

export default CalendarHeader;