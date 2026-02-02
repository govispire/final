import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, Trophy } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Star, PauseCircle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProgressDashboard = () => {
  const { journeyState } = useZeroToHero();

  const totalDays = journeyState.goalDuration || 30;
  const currentDay = journeyState.currentDay;
  const completedDays = journeyState.completedDays;

  // Calculate stats
  const completionRate = Math.round((completedDays.length / totalDays) * 100);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Goal Completion</p>
              <h3 className="text-2xl font-bold text-gray-900">{completionRate}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Current Streak</p>
              <h3 className="text-2xl font-bold text-gray-900">{journeyState.streak} Days</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Days Left</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalDays - completedDays.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total XP</p>
              <h3 className="text-2xl font-bold text-gray-900">{journeyState.xp}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Map */}
      <Card className="border-2 border-slate-200 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🗺️</span> Your Hero Journey
            </CardTitle>
            <Badge variant="outline" className="bg-white">
              {journeyState.goalDuration} Day Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] w-full p-6">
            <div className="relative max-w-2xl mx-auto pb-12">
              {/* Vertical Connector Line */}
              <div className="absolute left-8 top-4 bottom-0 w-1 bg-slate-200 -z-10" />

              {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                const isCompleted = completedDays.includes(day);
                const isCurrent = day === currentDay;
                const isLocked = day > currentDay;

                // Determine Day Content
                const subject = journeyState.selectedSubjects[(day - 1) % journeyState.selectedSubjects.length] || 'General';

                return (
                  <div key={day} className={`relative flex gap-6 mb-8 last:mb-0 group ${isLocked ? 'opacity-60 grayscale' : ''}`}>
                    {/* Status Node */}
                    <div className={`
                      flex-shrink-0 w-16 h-16 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-300
                      ${isCompleted ? 'bg-green-100 border-green-500 text-green-600' :
                        isCurrent ? 'bg-blue-600 border-blue-200 text-white shadow-lg shadow-blue-500/30 scale-110' :
                          'bg-slate-100 border-slate-300 text-slate-400'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6" />
                      ) : (
                        <span className="text-xl font-bold">{day}</span>
                      )}
                    </div>

                    {/* Content Card */}
                    <Card className={`flex-1 transition-all ${isCurrent ? 'border-blue-500 border-2 shadow-md ring-4 ring-blue-50' : 'hover:border-slate-300'}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-lg ${isCurrent ? 'text-blue-700' : 'text-slate-700'}`}>
                              Day {day}: {subject}
                            </h4>
                            {isCurrent && <Badge className="bg-blue-600">Current Goal</Badge>}
                          </div>
                          <p className="text-sm text-slate-500">
                            {isLocked ? 'Complete previous days to unlock' : 'Focus Area: Weakness Strengthening'}
                          </p>
                        </div>

                        <div>
                          {isLocked ? (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500">
                              <Lock className="w-3 h-3 mr-1" /> Locked
                            </Badge>
                          ) : isCompleted ? (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center text-green-600 font-bold">
                                <Star className="w-4 h-4 fill-green-600 mr-1" /> Completed
                              </div>
                              <span className="text-xs text-green-600/80">+500 XP Earned</span>
                            </div>
                          ) : (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <PlayCircle className="w-4 h-4 mr-2" /> Start
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}

              {/* Finish Line */}
              <div className="relative flex gap-6 mt-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-yellow-400 border-4 border-yellow-200 flex items-center justify-center z-10 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center">
                  <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Victory</h3>
                </div>
              </div>

            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
