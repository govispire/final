import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Target,
  Trophy,
  BookOpen,
  CheckCircle2,
  Lock,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

const ProgressDashboard = () => {
  const { journeyState } = useZeroToHero();

  if (journeyState.dailyPlans.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Journey Started</h3>
          <p className="text-gray-600">Start your journey to see progress tracking.</p>
        </CardContent>
      </Card>
    );
  }

  const totalDays = journeyState.dailyPlans.length;
  const completedDays = journeyState.completedDays.length;
  const completionRate = Math.round((completedDays / totalDays) * 100);

  // Calculate subject-wise progress
  const subjectProgress: Record<string, { completed: number; total: number }> = {};

  journeyState.dailyPlans.forEach(day => {
    day.chapters.forEach(chapter => {
      if (!subjectProgress[chapter.subject]) {
        subjectProgress[chapter.subject] = { completed: 0, total: 0 };
      }
      subjectProgress[chapter.subject].total++;
      if (chapter.completionPercentage === 100) {
        subjectProgress[chapter.subject].completed++;
      }
    });
  });

  // Calculate total resources completed
  let totalResourcesCompleted = 0;
  let totalResources = 0;

  journeyState.dailyPlans.forEach(day => {
    day.chapters.forEach(chapter => {
      const chapterResources = [
        ...chapter.resources.videos,
        ...chapter.resources.tests,
        ...chapter.resources.pdfs
      ];
      totalResources += chapterResources.length;
      totalResourcesCompleted += chapterResources.filter(r => r.completed).length;
    });
  });

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Journey Progress</p>
              <h3 className="text-2xl font-bold text-gray-900">{completionRate}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Days Completed</p>
              <h3 className="text-2xl font-bold text-gray-900">{completedDays}/{totalDays}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Journey Completion</span>
              <span className="text-sm font-semibold text-gray-900">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Resources Completed</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalResourcesCompleted}/{totalResources}
              </span>
            </div>
            <Progress value={(totalResourcesCompleted / totalResources) * 100} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{journeyState.currentDayIndex + 1}</div>
              <div className="text-sm text-gray-600">Current Day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{totalDays - completedDays}</div>
              <div className="text-sm text-gray-600">Days Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(subjectProgress).map(([subject, stats]) => {
            const percentage = Math.round((stats.completed / stats.total) * 100);

            return (
              <div key={subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{subject}</span>
                  </div>
                  <Badge variant="secondary">
                    {stats.completed}/{stats.total} Chapters
                  </Badge>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Journey Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {journeyState.dailyPlans.map((day, index) => {
              const isCompleted = day.allCompleted;
              const isCurrent = index === journeyState.currentDayIndex;
              const isLocked = !day.unlocked;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${isCurrent ? 'border-blue-500 bg-blue-50' :
                    isCompleted ? 'border-green-300 bg-green-50' :
                      isLocked ? 'border-gray-200 bg-gray-50 opacity-60' :
                        'border-gray-200'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-blue-500 text-white' :
                      isLocked ? 'bg-gray-300 text-gray-500' :
                        'bg-gray-400 text-white'
                    }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isLocked ? (
                      <Lock className="h-5 w-5" />
                    ) : (
                      <span className="font-bold">{day.dayNumber}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">
                        Day {day.dayNumber}
                      </span>
                      {isCurrent && <Badge className="bg-blue-600">Current</Badge>}
                      {isCompleted && <Badge className="bg-green-600">Completed</Badge>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {day.chapters.map(ch => ch.subject).join(', ')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {Math.round(day.chapters.reduce((sum, ch) => sum + ch.completionPercentage, 0) / day.chapters.length)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {day.chapters.length} chapters
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {completionRate === 100 && (
        <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-8 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Journey Complete! 🎉</h2>
            <p className="text-lg text-gray-700 mb-4">
              You've completed your Zero to Hero journey! All your weak areas are now strengths!
            </p>
            <Badge className="text-lg px-4 py-2 bg-purple-600">
              {totalDays} Days Completed
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProgressDashboard;
