import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Lock,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Sparkles,
  BookOpen,
  PlayCircle,
  Calculator,
  Brain,
  MessageSquare,
  Globe
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import ChapterDetail from './ChapterDetail';

const DailyPlan = () => {
  const { journeyState } = useZeroToHero();
  const [selectedChapter, setSelectedChapter] = useState<{ dayIndex: number, chapterId: string } | null>(null);

  if (journeyState.dailyPlans.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plan Generated</h3>
          <p className="text-gray-600">Please select your weak areas to generate a learning plan.</p>
        </CardContent>
      </Card>
    );
  }

  // If viewing chapter detail
  const selectedChapterData = selectedChapter
    ? journeyState.dailyPlans[selectedChapter.dayIndex]?.chapters.find(ch => ch.id === selectedChapter.chapterId)
    : null;

  if (selectedChapter && selectedChapterData) {
    return (
      <ChapterDetail
        chapter={selectedChapterData}
        dayIndex={selectedChapter.dayIndex}
        onBack={() => setSelectedChapter(null)}
      />
    );
  }

  const currentDay = journeyState.currentDayIndex;
  const totalDays = journeyState.dailyPlans.length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{currentDay + 1}/{totalDays}</div>
            <div className="text-sm text-gray-600">Current Day</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {journeyState.completedDays.length}
            </div>
            <div className="text-sm text-gray-600">Days Completed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((journeyState.completedDays.length / totalDays) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Plans */}
      <div className="space-y-4">
        {journeyState.dailyPlans.map((dayPlan, dayIndex) => {
          const isLocked = !dayPlan.unlocked;
          const isCurrent = dayIndex === currentDay;
          const isCompleted = dayPlan.allCompleted;
          const isPast = dayIndex < currentDay;

          const overallProgress = dayPlan.chapters.reduce((sum, ch) => sum + ch.completionPercentage, 0) / dayPlan.chapters.length;

          return (
            <Card
              key={dayIndex}
              className={`border-2 transition-all ${isCurrent ? 'border-blue-500 shadow-lg' :
                isCompleted ? 'border-green-300 bg-green-50' :
                  isLocked ? 'border-gray-200 bg-gray-50' :
                    'border-gray-200'
                }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' :
                      isCurrent ? 'bg-blue-500' :
                        isLocked ? 'bg-gray-400' :
                          'bg-purple-500'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : isLocked ? (
                        <Lock className="h-6 w-6 text-white" />
                      ) : (
                        <PlayCircle className="h-6 w-6 text-white" />
                      )}
                    </div>

                    <div>
                      <CardTitle className="text-xl">
                        Day {dayPlan.dayNumber}
                        {isCurrent && <Badge className="ml-2 bg-blue-600">Current</Badge>}
                        {isCompleted && <Badge className="ml-2 bg-green-600">Completed</Badge>}
                      </CardTitle>
                      <div className="text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(dayPlan.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {Math.round(overallProgress)}%
                    </div>
                    <div className="text-xs text-gray-600">
                      {dayPlan.chapters.length} chapters
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Overall Progress</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                {/* Chapters */}
                {isLocked ? (
                  <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <div className="font-medium text-gray-700">Locked</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Complete all chapters in Day {dayPlan.dayNumber - 1} to unlock
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dayPlan.chapters.map((chapter) => {
                      const Icon = getSubjectIcon(chapter.subject);

                      return (
                        <Card
                          key={chapter.id}
                          className={`cursor-pointer transition-all hover:shadow-md border-2 ${chapter.completionPercentage === 100
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-blue-300'
                            }`}
                          onClick={() => setSelectedChapter({ dayIndex, chapterId: chapter.id })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${chapter.subjectIcon || 'bg-blue-500'}`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-600 truncate">{chapter.subject}</div>
                                <div className="font-semibold text-gray-900 text-sm leading-tight">
                                  {chapter.topicName}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Progress value={chapter.completionPercentage} className="h-2" />

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                  {chapter.completionPercentage}% complete
                                </span>
                                {chapter.completionPercentage === 100 && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                )}
                              </div>

                              <Button
                                size="sm"
                                variant={chapter.completedAt ? "outline" : "default"}
                                className="w-full"
                              >
                                {chapter.completedAt ? 'Review' : chapter.startedAt ? 'Continue' : 'Start'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Day Complete Celebration */}
                {isCompleted && (
                  <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-green-600" />
                        <div>
                          <div className="font-semibold text-green-900">Day {dayPlan.dayNumber} Complete!</div>
                          <div className="text-sm text-green-700">
                            Excellent work! {dayIndex < totalDays - 1 && `Day ${dayPlan.dayNumber + 1} is now unlocked.`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Journey Complete */}
      {journeyState.completedDays.length === totalDays && (
        <Card className="border-2 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Journey Complete! 🎉</h2>
            <p className="text-lg text-gray-700 mb-4">
              You've mastered all your weak areas! You're now a Hero!
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

// Helper to get subject icon
function getSubjectIcon(subjectName: string) {
  const name = subjectName.toLowerCase();
  if (name.includes('quant') || name.includes('numerical')) return Calculator;
  if (name.includes('reasoning')) return Brain;
  if (name.includes('english')) return MessageSquare;
  if (name.includes('awareness') || name.includes('general')) return Globe;
  return BookOpen;
}

export default DailyPlan;
