"use client";

import { useState } from "react";
import { formatDistanceToNowStrict, addDays, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Reward = {
  id: number;
  name: string;
  coinCost: number;
  cooldownDays: number;
  lastRedeemed?: Date | null;
  isCustom?: boolean;
};

const initialRewards: Reward[] = [
  { id: 1, name: "Power Nap", coinCost: 100, cooldownDays: 1 },
  { id: 2, name: "Streak Shield", coinCost: 250, cooldownDays: 7 },
  { id: 3, name: "Color Theme Unlock", coinCost: 300, cooldownDays: 0 },
  { id: 4, name: "Double XP Day", coinCost: 500, cooldownDays: 14 },
  { id: 5, name: "Profile Badge", coinCost: 150, cooldownDays: 0 },
  { id: 6, name: "Mystery Surprise", coinCost: 100, cooldownDays: 3 },
];

export default function RewardsShop() {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [newRewardName, setNewRewardName] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("");
  const [newRewardCooldown, setNewRewardCooldown] = useState("");

  const handleRedeem = (id: number) => {
    setRewards((prev) =>
      prev.map((reward) =>
        reward.id === id
          ? { ...reward, lastRedeemed: new Date() }
          : reward
      )
    );
    // TODO: Deduct coins from user coins here
  };

  const handleAddReward = () => {
    if (!newRewardName || !newRewardCost || !newRewardCooldown) return;

    const newReward: Reward = {
      id: Date.now(),
      name: newRewardName,
      coinCost: parseInt(newRewardCost),
      cooldownDays: parseInt(newRewardCooldown),
      isCustom: true,
    };

    setRewards((prev) => [...prev, newReward]);
    setNewRewardName("");
    setNewRewardCost("");
    setNewRewardCooldown("");
  };

  const isRewardAvailable = (reward: Reward) => {
    if (!reward.lastRedeemed) return true;
    const nextAvailable = addDays(reward.lastRedeemed, reward.cooldownDays);
    return isBefore(new Date(), nextAvailable) ? false : true;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-0">
      <Card className="mb-8 mt-5">
        <CardContent className="overflow-x-auto p-4">
          <h1 className="text-2xl font-bold text-center">🎁 Rewards Shop</h1>
          <h2 className="text-md font-bold mt-2 mb-5 text-center">Your Coins: </h2>

          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Reward</th>
                <th className="p-2">Cost (coins)</th>
                <th className="p-2">Cooldown</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => {
                const available = isRewardAvailable(reward);
                const nextAvailable = reward.lastRedeemed
                  ? formatDistanceToNowStrict(
                      addDays(reward.lastRedeemed, reward.cooldownDays),
                      { addSuffix: true }
                    )
                  : null;

                return (
                  <tr key={reward.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-semibold">
                      {reward.name}
                      {reward.isCustom && (
                        <span className="text-xs ml-2 text-muted-foreground">(Custom)</span>
                      )}
                    </td>
                    <td className="p-2">{reward.coinCost}</td>
                    <td className="p-2">
                      {reward.cooldownDays > 0 ? `${reward.cooldownDays}d` : "None"}
                    </td>
                    <td className="p-2">
                      {available ? (
                        <Button size="sm" onClick={() => handleRedeem(reward.id)}>
                          Redeem
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          ⏳ {nextAvailable}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">➕ Add Your Own Reward</h2>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Reward name"
              value={newRewardName}
              onChange={(e) => setNewRewardName(e.target.value)}
            />
            <Input
              placeholder="Coin cost"
              type="number"
              value={newRewardCost}
              onChange={(e) => setNewRewardCost(e.target.value)}
            />
            <Input
              placeholder="Cooldown (days)"
              type="number"
              value={newRewardCooldown}
              onChange={(e) => setNewRewardCooldown(e.target.value)}
            />
            <Button className="mt-2" onClick={handleAddReward}>
              Add Reward
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
