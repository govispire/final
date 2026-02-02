import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Flame, Rocket, Check } from 'lucide-react';
import { useZeroToHero, GoalDuration } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const GoalSelection = () => {
  const { selectGoal } = useZeroToHero();
  const [selectedGoal, setSelectedGoal] = useState<GoalDuration | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const goals = [
    {
      duration: 5 as GoalDuration,
      title: '5-Day Boost',
      description: 'Quick skill improvement',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600',
      features: ['Perfect for beginners', 'Quick wins', 'Build momentum']
    },
    {
      duration: 10 as GoalDuration,
      title: '10-Day Challenge',
      description: 'Build daily discipline',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      features: ['Balanced approach', 'Form habits', 'Steady progress']
    },
    {
      duration: 30 as GoalDuration,
      title: '30-Day Mastery',
      description: 'Go from Zero to Hero',
      icon: Rocket,
      color: 'from-primary to-brand-darkteal',
      features: ['Complete transformation', 'Deep learning', 'Master concepts'],
      recommended: true
    }
  ];

  const handleGoalSelect = (duration: GoalDuration) => {
    setSelectedGoal(duration);
    setShowConfirmation(true);
  };

  const confirmGoal = () => {
    if (selectedGoal) {
      selectGoal(selectedGoal);
      toast({
        title: 'Goal Locked! 🎯',
        description: 'Stay consistent for best results.',
        type: 'success'
      });
    }
    setShowConfirmation(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Select Your Goal Duration</h2>
        <p className="text-gray-600">Choose a plan that fits your schedule and commitment level</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card 
            key={goal.duration}
            className={`relative overflow-hidden border-2 transition-all hover:shadow-xl cursor-pointer ${
              selectedGoal === goal.duration ? 'border-primary shadow-lg' : 'border-gray-200'
            }`}
            onClick={() => handleGoalSelect(goal.duration)}
          >
            {goal.recommended && (
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </span>
              </div>
            )}
            
            <CardHeader>
              <div className={`w-16 h-16 bg-gradient-to-br ${goal.color} rounded-2xl flex items-center justify-center mb-4`}>
                <goal.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{goal.title}</CardTitle>
              <CardDescription className="text-base">{goal.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                {goal.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full bg-gradient-to-r ${goal.color} hover:opacity-90 text-white`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGoalSelect(goal.duration);
                }}
              >
                Choose {goal.duration}-Day Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Goal 🎯</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>You've selected the <span className="font-semibold text-gray-900">{selectedGoal}-Day Challenge</span>.</p>
              <p className="text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                ⚠️ Once locked, stay consistent! You can pause for up to 3 days, but beyond that progress will be locked until pending tasks are completed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Go Back
            </Button>
            <AlertDialogAction onClick={confirmGoal}>
              Lock Goal & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoalSelection;
