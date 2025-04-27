import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { Flame, Target, Star, Atom, UserRound } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const navItems = [
  { name: 'Tracker', href: '/dashboard', icon: Atom },
  { name: 'Rewards Shop', href: '/rewards', icon: Target },
  { name: 'Leaderboard', href: '/leaderboard', icon: Flame },
  { name: 'Account', href: '/account', icon: UserRound },
]

export const AVAILABLE_COLORS = [
  '#077A7D',
  '#FE7743',
  '#C5172E',
  '#FFD63A',
  '#3F7D58'
]

export const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

export const getCurrentDay = (year: number, month: number, day: number) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayOfWeekNumber = new Date(year, month, day).getDay();
  const dayOfWeekName = daysOfWeek[dayOfWeekNumber];

  return dayOfWeekName;
}

export const getWeeksInMonth = (year: number, month: number) => {
  const totalDays = getDaysInMonth(year, month);
  // const weeks: number[][] = [];

  // for (let i = 0; i < totalDays; i += 7) {
  //   weeks.push(Array.from({ length: Math.min(7, totalDays - i) }, (_, j) => i + j + 1));
  // }

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Break into weeks (arrays of 7)
  const weeks = [];
  for (let i = 0; i < daysArray.length; i += 7) {
    weeks.push(daysArray.slice(i, i + 7));
  }

  return weeks;
};

export const getMonthFromIndex = (month: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  return months[month];
}