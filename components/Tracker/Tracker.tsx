"use client"

import { useEffect, useState } from 'react'
import { Atom, CompletionMap } from '@/lib/types'
import { getWeeksInMonth } from '@/lib/utils'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
import SectionList from './SectionList'
import supabase from '@/lib/supabase'
import UserStats from '../UserStats'
import CalendarHeader from './CalenderHeader'
import { Charts } from '../Charts'
import useUser from '@/hooks/useUser'
import { Card } from '../ui/card'
import useAtomDialog from '@/hooks/useAtomDialog'
import HelperAI from '../HelperAI'

// * Add XP system and levels - Done
// * Fix confetti on box check - Done
// * Add Supabase Backend DB - Done
// * Fix wrong date, that is, +1 date display tick in grid
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
// * Implement Leaderboard
// * Added AI Helper - Gemini 2.0 Flash
// * Impelement Rewards Shop
// * Add Responsiveness
// * Add Small Device Sidebar Toggle
// * Finish Helper AI Implementation
// * Tailwind CSS Colors Implement
// * Add Light and Dark Mode
// * On deletion of atom, XP and level is resetting to 0 and 1 respectively ??
// ? Google Login should route to /dashboard and not /

// ! Test optimistic updates on failure rollback working or not

// TODO: Continue Backend
// TODO: Implement Caching
// TODO: Complete Rewards Shop

// * ------ MVP DONE ------

// TODO: Implement cores, pathways and legacies
// TODO: Complete Backend

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
  const [confettiOpacity, setConfettiOpacity] = useState(1);
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

      // const res = await fetch(`/api/atoms?userId=${user?.id}`, { cache: "no-store" })
      // const data = await res.json()

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
    let opacity = 1;
    setConfettiPieces(pieces);
    setConfettiOpacity(opacity);

    const interval = setInterval(() => {
      if (pieces > 100) {
        pieces = Math.max(0, pieces - 100);
      } else {
        pieces = Math.max(0, pieces - 20);
      }

      // Decrease opacity smoothly
      opacity = Math.max(0.1, opacity - 0.1); // Don't go fully invisible
      setConfettiPieces(pieces);
      setConfettiOpacity(opacity);

      if (pieces === 0) {
        clearInterval(interval);
      }
    }, 500);
    };


  const toggleCompletion = async (habitId: string, xp: number, date: string) => {
    const isCompleted = completions[habitId]?.includes(date) ?? false;
    const deltaXp = isCompleted ? -xp : xp;

    // 1. Optimistically update UI
    let previousCompletions = structuredClone(completions)
    let previousLevel = level
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

      let newLevel = 1;
      while (newXp >= 50 * (newLevel * newLevel)) {
        newLevel++;
      }
      setLevel(newLevel);

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
      // ! toast error
      setCompletions(previousCompletions)

    // rollback XP and level too
      setXp((prevXp) => {
        const newXp = prevXp - deltaXp;
        setLevel(previousLevel);
        return newXp;
      });
    }
  };

  return (
    <div className='flex flex-col gap-2 items-center justify-center mt-10'>
      <UserStats level={level} xp={xp}/>

      {hasMounted && confettiPieces > 0 && (
        <div style={{ opacity: confettiOpacity, transition: 'opacity 0.5s linear' }}>
        <Confetti
          width={width-20}
          height={height}
          numberOfPieces={confettiPieces}
          recycle={false}
        />
        </div>
      )}

      <HelperAI />

      <Card className={`w-full max-w-4xl p-10 justify-center items-center grid gap-[10px]`} style={{ gridTemplateColumns: `150px repeat(${currentWeekDays.length}, 32px)` }}>
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
        <div className="text-sm text-muted-foreground mt-10">Loading your stats...</div>
      )}
    </div>
  )
}

export default Tracker