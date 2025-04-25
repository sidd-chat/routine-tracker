"use client"

import { useEffect, useState } from 'react'
import { Atom, CompletionMap } from '@/lib/types'
import { getCurrentDay, getDaysInMonth, getWeeksInMonth } from '@/lib/utils'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import SectionList from './SectionList'
import { Button } from '../ui/button'
import supabase from '@/lib/supabase'
import UserStats from '../UserStats'
import CalendarHeader from './CalenderHeader'
import AddAtomItem from './AddAtomItem'
import { Charts } from '../Charts'
import useUser from '@/hooks/useUser'
import { Card } from '../ui/card'
import useAtomDialog from '@/hooks/useAtomDialog'


// * Add XP system and levels - Done
// * Fix confetti on box check - Done
// * Add Supabase Backend DB - Done
// * Fix wrong, that is, +1 date display tick in grid
// * Add Supabase Auth
// * Implement RLS
// * CRU out of CRUD Done
// * Fix atom list not updating immediately after edit atom
// * Add XP to each Atom
// * CRUD Complete
// * Implement basic tasks fully frontend and backend
// * Get Chart Up and Running
// * Add XP and Levels Implementation Backend
// * Add XP and Levels Implementation Frontend
// * Check if on updating atom XP, charts update or not
// ? Google Login should route to /dashboard and not /

// ! Test optimistic updates on failure rollback working or not

// ? Impelement Rewards Shop
// ? Continue Backend

// ? Add Responsiveness
// ? Improve Design

// * ------ MVP DONE ------

// ? Implement cores, pathways and legacies
// ? Implement Leaderboard
// ? Complete Backend

const XP_PER_COMPLETION = 10;
const XP_PER_LEVEL = 100;

const Tracker = () => {
  const date = new Date();

  const year = date.getFullYear()
  const month = date.getMonth();

  const weekDays = getWeeksInMonth(year, month);
  const numberOfWeeks = weekDays.length;
  const todayDate = date.getDate();
  const defaultWeekIndex = weekDays.findIndex(week => week.includes(todayDate));

  const [atoms, setAtoms] = useState<Atom[]>([])
  const [completions, setCompletions] = useState<CompletionMap>({});
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [confettiPieces, setConfettiPieces] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(defaultWeekIndex);
  const [error, setError] = useState<string>('')

  const { width, height } = useWindowSize();

  const currentWeekDays = weekDays[currentWeekIndex];

  const { user, loading, isLoggedIn } = useUser();
  const { dialog, openAddDialog, openEditDialog } = useAtomDialog({ userId: user?.id, atoms, setAtoms})

  useEffect(() => {
    if(loading || !isLoggedIn)
      return;

    const fetchAtoms = async () => {
      const { data, error } = await supabase
        .from('atoms')
        .select()
        .eq('user_id', user?.id)
        .order('created_at', {ascending: true})

      if(error) {
        setError('Error Fetching Atoms')
        console.log(error)
      }

      if(data) {
        setAtoms(data)
        setError('')
      }
    }

    const fetchCompletionsMap = async () => {
      const { data, error } = await supabase
        .from('completions')
        .select('habit_id, date')
        .eq('user_id', user?.id)

      if(error) {
        console.log('Error Fetching Completions Map', error)
      }
      if(data) {
        const completionMap: CompletionMap = data.reduce((acc: CompletionMap, curr: { habit_id: string; date: string }) => {
          if (!acc[curr.habit_id]) {
            acc[curr.habit_id] = []
          }

          acc[curr.habit_id].push(curr.date)

          return acc
        }, {} as CompletionMap)

        setCompletions(completionMap)
      }
    }

    const fetchUserXpAndLevel = async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select()
        .eq('user_id', user?.id)
        .single()

      if(error) {
        console.log('Error fetching XP and Level:', error)
      }

      if (data) {
        setXp(data.total_xp)
        setLevel(data.level)
      }
    }


    fetchAtoms();
    fetchCompletionsMap();
    fetchUserXpAndLevel();
    setHasMounted(true);
  }, [user]);

  const triggerConfetti = () => {
    let pieces = 1000;
    setConfettiPieces(pieces);

    const interval = setInterval(() => {
      pieces = Math.max(0, pieces - (pieces > 100 ? 100 : 20));
      setConfettiPieces(pieces);

      if (pieces === 0) {
        clearInterval(interval);
      }
    }, 500);
  };

  const toggleCompletion = async (habitId: string, date: string) => {
    const isCompleted = completions[habitId]?.includes(date) ?? false;
    const deltaXp = isCompleted ? -XP_PER_COMPLETION : XP_PER_COMPLETION;

    // 1. Optimistically update UI
    const previousCompletions = structuredClone(completions)
    setCompletions((prev) => {
      const updated = isCompleted
        ? prev[habitId].filter((d) => d !== date)
        : [...(prev[habitId] || []), date];

      return {
        ...prev,
        [habitId]: updated,
      };
    });

    // 2. Update XP and level
    setXp((prevXp) => {
      const newXp = prevXp + deltaXp;
      setLevel(Math.floor(newXp / XP_PER_LEVEL) + 1);
      return newXp;
    });

    // 3. Trigger confetti on new completion
    if (!isCompleted) {
      triggerConfetti();
    }

    // 4. Sync with Supabase
    try {
      if (isCompleted) {
        // delete existing completion
        const { error } = await supabase
          .from('completions')
          .delete()
          .eq('user_id', user?.id)
          .eq('habit_id', habitId)
          .eq('date', date);

        if (error) throw error;
      } else {
        // insert new completion
        const { error } = await supabase.from('completions').insert({
          habit_id: habitId,
          date,
          user_id: user?.id,
        });

        if (error) throw error;
      }
    } catch (err) {
      console.error('❌ Failed to sync with Supabase:', err);
      // ! toast error + rollback frontend state
      setCompletions(previousCompletions)

    // ❗ Bonus: rollback XP and level too
      setXp((prevXp) => {
        const newXp = prevXp - deltaXp;
        setLevel(Math.floor(newXp / XP_PER_LEVEL) + 1);
        return newXp;
      });
    }
  };

  return (
    <div className='flex flex-col gap-2 items-center mt-10'>
      <UserStats level={level} xp={xp}/>

      {hasMounted && confettiPieces > 0 && (
        <Confetti
          width={width-20}
          height={height}
          numberOfPieces={confettiPieces}
          recycle={false}
        />
      )}

      {/* <div className={`w-200 grid grid-cols-[150px_repeat(${currentWeekDays.length},32px)] auto-rows-min gap-[10px]`}> */}
      <Card className={`w-full max-w-4xl p-10 justify-center items-center grid grid-cols-[150px_repeat(${currentWeekDays.length},32px)] auto-rows-min gap-[10px]`}>
      {/* <div className={`grid grid-cols-[150px_repeat(7,32px)] auto-rows-min gap-[10px]`}> */}
        <CalendarHeader
          year={year}
          month={month}
          currentWeek={currentWeekDays}
          currentWeekIndex={currentWeekIndex}
          onPrevWeek={() => setCurrentWeekIndex(i => Math.max(0, i - 1))}
          onNextWeek={() => setCurrentWeekIndex(i => Math.min(numberOfWeeks - 1, i + 1))}
          canGoPrev={currentWeekIndex > 0}
          canGoNext={currentWeekIndex < numberOfWeeks - 1}
        />

        <SectionList
          title="Atoms"
          atoms={atoms}
          setAtoms={setAtoms}
          type="atom"
          completions={completions}
          toggleCompletion={toggleCompletion}
          year={year}
          month={month}
          currentWeekDays={currentWeekDays}
        />

        <div className="col-span-full flex justify-center items-center mt-4">
          {dialog}
        </div>
      </Card>

      {user ? (
        <Charts userId={user.id} />
      ) : (
        <div className="text-sm text-muted-foreground">Loading your stats...</div>
      )}
    </div>
  )
}

export default Tracker