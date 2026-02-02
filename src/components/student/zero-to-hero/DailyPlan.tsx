import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Video, Brain, FileQuestion, RotateCcw, ClipboardCheck, Lock, Check, Pause } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';

import confetti from 'canvas-confetti';

import AIInsightsCard from '@/components/student/zero-to-hero/AIInsightsCard';

const DailyPlan = () => {
  const { journeyState, completeTask, pauseJourney } = useZeroToHero();

  const currentDay = journeyState.currentDay;
  const totalDays = journeyState.goalDuration || 30;
  const dailyTasks = journeyState.dailyTasks[currentDay] || [];
  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const totalTasks = dailyTasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const dayProgress = (currentDay / totalDays) * 100;

  // Extract subject from first task for AI context
  const currentSubject = dailyTasks.length > 0 ? dailyTasks[0].title.split(' - ')[0] : 'General';

  const taskIcons = {
    video: Video,
    flashcard: Brain,
    quiz: FileQuestion,
    revision: RotateCcw,
    test: ClipboardCheck
  };

  const taskColors = {
    video: 'from-blue-500 to-blue-600',
    flashcard: 'from-purple-500 to-purple-600',
    quiz: 'from-green-500 to-green-600',
    revision: 'from-orange-500 to-orange-600',
    test: 'from-red-500 to-red-600'
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(currentDay, taskId);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: 'Task Completed! ✅',
      description: 'Great progress! +50 XP',
      type: 'success'
    });
  };

  const handlePause = () => {
    if (journeyState.pausedDays >= 3) {
      toast({
        title: 'Cannot Pause',
        description: 'You have already used all 3 pause days. Please complete pending tasks.',
        type: 'error'
      });
      return;
    }

    pauseJourney();
    toast({
      title: 'Journey Paused',
      description: `You have ${3 - journeyState.pausedDays - 1} pause days remaining.`,
      type: 'info'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Day {currentDay} of {totalDays}</h2>
              <p className="text-blue-100">Keep Going! You're doing great 💪</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{journeyState.streak} 🔥</p>
              <p className="text-sm text-blue-100">Day Streak</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(dayProgress)}%</span>
            </div>
            <Progress value={dayProgress} className="bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* AI Insight */}
      <AIInsightsCard subject={currentSubject} day={currentDay} />

      {/* Daily Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Progress</span>
            <span className="text-sm font-normal text-gray-600">
              {completedTasks} / {totalTasks} Tasks Completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="mb-2" />
          <p className="text-sm text-gray-600">{Math.round(progressPercent)}% Complete</p>
        </CardContent>
      </Card>

      {/* Task Cards */}
      <div className="grid gap-4">
        {dailyTasks.map((task, index) => {
          const TaskIcon = taskIcons[task.type];
          const isLocked = index > 0 && !dailyTasks[index - 1].completed;

          return (
            <Card
              key={task.id}
              className={`border-2 transition-all ${task.completed
                ? 'border-green-500 bg-green-50'
                : isLocked
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : 'border-blue-300 hover:shadow-lg'
                }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${taskColors[task.type]}`}>
                    {task.completed ? (
                      <Check className="h-7 w-7 text-white" />
                    ) : isLocked ? (
                      <Lock className="h-7 w-7 text-white" />
                    ) : (
                      <TaskIcon className="h-7 w-7 text-white" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      {task.completed && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                          Completed ✓
                        </span>
                      )}
                      {isLocked && (
                        <span className="bg-gray-200 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                          Locked 🔒
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500">⏱️ {task.duration} mins</span>
                      {!task.completed && !isLocked && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Start Task
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pause Button */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Need a Break?</p>
              <p className="text-xs text-gray-600">
                You have {3 - journeyState.pausedDays} pause days remaining
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              disabled={journeyState.pausedDays >= 3}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause Journey
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyPlan;
