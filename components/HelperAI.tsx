'use client';

import { Bot, Send, Trash } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Atom } from '@/lib/types';
import supabase from '@/lib/supabase';
import useUser from '@/hooks/useUser';

export function validateAtoms(data: any): Atom[] {
  if (!Array.isArray(data)) {
    throw new Error("Expected an array of atoms.");
  }

  return data.map((item, index) => {
    if (typeof item.name !== 'string') {
      throw new Error(`Atom at index ${index} is missing a valid name.`);
    }
    if (typeof item.color !== 'string') {
      throw new Error(`Atom at index ${index} is missing a valid color.`);
    }
    if (typeof item.xp !== 'number') {
      throw new Error(`Atom at index ${index} is missing a valid xp value.`);
    }
    return item as Atom;
  });
}

const HelperAI = () => {
  const { user } = useUser();

  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [atoms, setAtoms] = useState<Atom[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleSlashFocus = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault(); // Prevent typing '/' elsewhere
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleSlashFocus);
    return () => window.removeEventListener('keydown', handleSlashFocus);
  }, []);

  const generateHabits = async (userGoal: string) => {
    try {
      setLoading(true);

      const res = await fetch('/api/generate-habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userGoal }),
      });

      const data = await res.json();

      const aiText = data.aiReply;
      const parsedReply = typeof aiText === 'string' ? JSON.parse(aiText) : aiText;
      setAtoms(parsedReply);
      setUserGoal('');
    } catch (error) {
      console.error('Error generating habits:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveHabitsToSupabase = async (userId: string | undefined) => {
    if (!userId || atoms.length === 0) return;

    const inserts = atoms.map(atom => ({
      user_id: userId,
      name: atom.name,
      color: atom.color,
      xp: Number(atom.xp),
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase.from('atoms').insert(inserts);

    if (error) {
      console.error('Failed to save atoms:', error);
    } else {
      console.log('Saved atoms:', atoms);
      setAtoms([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userGoal.trim()) return;

    await generateHabits(userGoal);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl shadow-md"
      >
        <Bot size={24} className="text-gray-500 dark:text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Tap '/' to tell me your goal... I'll create your habits!"
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none focus-visible:ring-0 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 h-full"
          value={userGoal}
          onChange={(e) => setUserGoal(e.target.value)}
        />
        <Button
          type="submit"
          size="icon"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <Send size={18} className="cursor-pointer" />
          )}
        </Button>
      </form>

      {atoms.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md">
          <h2 className="text-lg font-semibold mb-4">AI Suggested Habits:</h2>
          <ul className="space-y-2">
            {atoms.map((atom, index) => (
              <li
                key={index}
                className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex flex-col md:flex-row items-center justify-between gap-3"
              >
                <div className="flex flex-col md:flex-row gap-2 items-center flex-1">
                  <Input
                    type="text"
                    value={atom.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setAtoms((prev) => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], name: newName };
                        return updated;
                      });
                    }}
                    className="flex-1"
                    placeholder="Habit name"
                  />
                  <Input
                    type="number"
                    value={atom.xp}
                    onChange={(e) => {
                      const newXp = parseInt(e.target.value) || 0;
                      setAtoms((prev) => {
                        const updated = [...prev];
                        updated[index] = { ...updated[index], xp: newXp };
                        return updated;
                      });
                    }}
                    className="w-24"
                    placeholder="XP"
                  />
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setAtoms(prev => prev.filter((_, i) => i !== index))}
                >
                  <Trash size={18} />
                </Button>
              </li>
            ))}
          </ul>

          <Button
            className="mt-5 cursor-pointer"
            onClick={() => saveHabitsToSupabase(user?.id)}
          >
            Save to My Atoms
          </Button>

          <Button
            className="ml-2 cursor-pointer"
            variant="destructive"
            onClick={() => setAtoms([])}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default HelperAI;
