'use client';

import { Bot, Send } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button'; // Assuming you have a button component
import { Atom } from '@/lib/types';
import { AVAILABLE_COLORS } from '@/lib/utils';
import supabase from '@/lib/supabase';

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
  const [userGoal, setUserGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [atoms, setAtoms] = useState<Atom[]>([]);

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

  const saveHabitsToSupabase = async (userId: string) => {
    if (atoms.length === 0) return;

    const inserts = atoms.map(atom => ({
      user_id: userId,
      name: atom.name, // assuming AI output format
      color: atom.color,
      xp: atom.xp,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase.from('atoms').insert(inserts);

    if (error) {
      console.error('Failed to save atoms:', error);
    } else {
      console.log('Saved atoms:', data);
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
        <Input
          type="text"
          placeholder="Tell me your goal... I'll create your habits!"
          className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
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
            <Send size={18} />
          )}
        </Button>
      </form>

      {atoms.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-white dark:bg-gray-900 shadow-md">
          <h2 className="text-lg font-semibold mb-4">AI Suggested Habits:</h2>
          <ul className="space-y-2">
            {atoms.map((atom, index) => (
              <li key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                <span>
                  <strong>{atom.name}</strong> - {atom.xp} XP
                </span>

              </li>
            ))}
          </ul>

          <Button
            className='mt-5 cursor-pointer'
            onClick={() => saveHabitsToSupabase('user-id')}
          >
            Save to My Atoms
          </Button>

          <Button
            className='ml-2 cursor-pointer'
            variant='destructive'
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
