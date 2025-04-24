import { getCurrentDay, getMonthFromIndex } from '@/lib/utils';
import React from 'react'
import { Button } from '../ui/button';

// const CalendarHeader = ({ totalDays, year, month }: { totalDays: number; year: number; month: number }) => (
//   <>
//     <div className="bg-background font-bold">Atoms</div>
//     {Array.from({ length: totalDays }, (_, i) => (
//       <div key={i} className='flex flex-col gap-2'>
//         <div className="text-center text-sm">{i + 1}</div>
//         <div className="text-center text-sm">{getCurrentDay(year, month, i + 1)}</div>
//       </div>
//     ))}
//   </>
// );

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

    <div className="bg-background font-bold"></div>

    {currentWeek.map((day) => (
      <div key={day} className="text-center text-sm">
        <div>{day}</div>
        <div>{getCurrentDay(year, month, day)}</div>
      </div>
    ))}
  </>
);


export default CalendarHeader;