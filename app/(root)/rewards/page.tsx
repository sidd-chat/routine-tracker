"use client"

import { useState, useEffect } from 'react';

interface Reward {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function Rewards({ userId }: { userId: string }) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tokens, setTokens] = useState<number>(0);
  const [newReward, setNewReward] = useState<{ name: string; description: string; price: number }>({
    name: '',
    description: '',
    price: 0
  });

  // Mock data for rewards and user stats
  useEffect(() => {
    // Mock the reward list (replace with actual API call)
    const fetchedRewards: Reward[] = [
      { id: '1', name: 'Custom Avatar', description: 'A custom avatar for your profile', price: 50 },
      { id: '2', name: 'Gift Card', description: 'A $10 gift card', price: 100 },
      { id: '3', name: 'Premium Theme', description: 'A premium profile theme', price: 150 },
    ];
    setRewards(fetchedRewards);

    // Mock user tokens (replace with actual user data fetching)
    const mockTokens = 200;  // Example of user tokens based on XP and level
    setTokens(mockTokens);
  }, []);

  const handlePurchase = (rewardId: string, price: number) => {
    if (tokens >= price) {
      setTokens(tokens - price);
      alert('Reward purchased!');
    } else {
      alert('You do not have enough tokens!');
    }
  };

  const handleAddReward = () => {
    if (newReward.name && newReward.price > 0) {
      const newRewardData = { ...newReward, id: `${Date.now()}` };
      setRewards([newRewardData, ...rewards]);
      setNewReward({ name: '', description: '', price: 0 });
      alert('New reward added successfully!');
    } else {
      alert('Please provide all required information');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Tokens: {tokens}</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Available Rewards</h3>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="p-4 border rounded-md shadow-md">
              <h4 className="text-lg font-semibold">{reward.name}</h4>
              <p>{reward.description}</p>
              <p className="text-sm text-gray-500">Price: {reward.price} Tokens</p>
              <button
                onClick={() => handlePurchase(reward.id, reward.price)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add a New Reward</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newReward.name}
            onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
            placeholder="Reward Name"
            className="p-2 w-full border rounded-md"
          />
          <textarea
            value={newReward.description}
            onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
            placeholder="Reward Description"
            className="p-2 w-full border rounded-md"
          />
          <input
            type="number"
            value={newReward.price}
            onChange={(e) => setNewReward({ ...newReward, price: parseInt(e.target.value) })}
            placeholder="Reward Price (Tokens)"
            className="p-2 w-full border rounded-md"
          />
          <button
            onClick={handleAddReward}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Reward
          </button>
        </div>
      </div>
    </div>
  );
}
