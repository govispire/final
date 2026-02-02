import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Star, Zap, Target } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

const RewardsSection = () => {
  const { journeyState } = useZeroToHero();

  const allBadges = [
    { id: 'first_day', name: 'First Step', icon: Star, description: 'Completed Day 1', unlocked: journeyState.completedDays.length >= 1 },
    { id: 'streak_5', name: '5-Day Streak', icon: Zap, description: '5 consecutive days', unlocked: journeyState.streak >= 5 },
    { id: 'streak_10', name: '10-Day Warrior', icon: Trophy, description: '10 consecutive days', unlocked: journeyState.streak >= 10 },
    { id: 'halfway', name: 'Halfway Hero', icon: Target, description: '50% journey completed', unlocked: journeyState.completedDays.length >= (journeyState.goalDuration || 30) / 2 },
    { id: 'accuracy_80', name: 'Accuracy Champ', icon: Award, description: '80%+ accuracy', unlocked: journeyState.totalAccuracy >= 80 },
    { id: 'all_subjects', name: 'Multi-Tasker', icon: Medal, description: 'Completed all subjects', unlocked: journeyState.selectedSubjects.length >= 3 },
  ];

  const unlockedBadges = allBadges.filter(b => b.unlocked);
  const lockedBadges = allBadges.filter(b => !b.unlocked);

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">Your Achievements</h3>
              <p className="text-yellow-100">Badges Earned: {unlockedBadges.length} / {allBadges.length}</p>
            </div>
            <Trophy className="h-16 w-16 opacity-80" />
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Unlocked Badges ({unlockedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {unlockedBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <div 
                  key={badge.id}
                  className="relative p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 text-center space-y-3"
                >
                  <div className="absolute top-2 right-2">
                    <span className="text-2xl">✨</span>
                  </div>
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <BadgeIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{badge.name}</h4>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {unlockedBadges.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Complete tasks to unlock your first badge! 🎯
            </p>
          )}
        </CardContent>
      </Card>

      {/* Locked Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-gray-400" />
            Locked Badges ({lockedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <div 
                  key={badge.id}
                  className="p-6 rounded-xl bg-gray-100 border-2 border-gray-300 text-center space-y-3 opacity-60"
                >
                  <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                    <BadgeIcon className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-700">{badge.name}</h4>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                  <span className="text-2xl">🔒</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;
