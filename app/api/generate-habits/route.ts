import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userGoal } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  const prompt = generateHabitPrompt(userGoal);

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  };

  const url = `${endpoint}?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return NextResponse.json({ aiReply });
}

function generateHabitPrompt(userGoal: string) {
  return `
You are an expert life coach and productivity strategist.
A user has shared the following goal with you:

"${userGoal}"

Your task:
- Break it down into simple, achievable daily habits known as 'atoms'.
- Each atom must follow the SMART principle (Specific, Measurable, Achievable, Relevant, Time-bound).
- Suggest 2 to 5 habits maximum.
- Be realistic based on normal human energy levels.
- Write output only as a valid JSON array without any extra words.

Return only a valid JSON block without any markdown formatting or backticks:
[
  {
    "name": "Habit name within 10 characters",
    "color": "Appropriate color corresponding to the habit, e.g. '#077A7D' ",
    "xp": "Depending on the difficulty and reward of the habit with respect to the goal, return an xp value that is 5, 10, 15, or 20. No less than 5 and no more than 20.",
  },
]

DO NOT include any text or advice outside of the JSON array.
`;
}
    // "description": "A short description describing the benefit and the reason to perform the habit",