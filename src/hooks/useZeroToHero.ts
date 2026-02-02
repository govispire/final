import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type GoalDuration = 5 | 10 | 30;
export type JourneyStep = 'welcome' | 'goal-selection' | 'subject-selection' | 'active-journey' | 'journey-complete';

export interface WeakArea {
  subject: string;
  topics: string[];
}

export interface DailyTask {
  id: string;
  type: 'video' | 'flashcard' | 'quiz' | 'revision' | 'test';
  title: string;
  description: string;
  completed: boolean;
  duration: number;
}

export interface JourneyState {
  currentStep: JourneyStep;
  goalDuration: GoalDuration | null;
  selectedSubjects: string[];
  weakAreas: WeakArea[];
  currentDay: number;
  startDate: string | null;
  pausedDays: number;
  dailyTasks: Record<number, DailyTask[]>;
  completedDays: number[];
  streak: number;
  totalAccuracy: number;
  xp: number;
  level: number;
  badges: string[];
}

const initialState: JourneyState = {
  currentStep: 'welcome',
  goalDuration: null,
  selectedSubjects: [],
  weakAreas: [],
  currentDay: 1,
  startDate: null,
  pausedDays: 0,
  dailyTasks: {},
  completedDays: [],
  streak: 0,
  totalAccuracy: 0,
  xp: 0,
  level: 1,
  badges: [],
};

export function useZeroToHero() {
  const [journeyState, setJourneyState] = useLocalStorage<JourneyState>('zero_to_hero_journey', initialState);

  const hasActiveJourney = journeyState.currentStep === 'active-journey' && journeyState.goalDuration !== null;

  const startJourney = () => {
    setJourneyState(prev => ({
      ...prev,
      currentStep: 'goal-selection'
    }));
  };

  const selectGoal = (duration: GoalDuration) => {
    setJourneyState(prev => ({
      ...prev,
      goalDuration: duration,
      currentStep: 'subject-selection'
    }));
  };

  const selectSubjectsAndWeakAreas = (subjects: string[], weakAreas: WeakArea[]) => {
    const startDate = new Date().toISOString();
    const dailyTasks = generateDailyTasks(journeyState.goalDuration!, subjects, weakAreas);

    setJourneyState(prev => ({
      ...prev,
      selectedSubjects: subjects,
      weakAreas: weakAreas,
      startDate: startDate,
      currentStep: 'active-journey',
      dailyTasks: dailyTasks
    }));
  };

  const completeTask = (day: number, taskId: string) => {
    setJourneyState(prev => {
      const updatedTasks = { ...prev.dailyTasks };
      let xpGained = 0;

      if (updatedTasks[day]) {
        updatedTasks[day] = updatedTasks[day].map(task => {
          if (task.id === taskId && !task.completed) {
            xpGained = 50; // Award 50 XP per task
            return { ...task, completed: true };
          }
          return task;
        });
      }

      const allTasksCompleted = updatedTasks[day]?.every(task => task.completed);
      const completedDays = allTasksCompleted && !prev.completedDays.includes(day)
        ? [...prev.completedDays, day]
        : prev.completedDays;

      const newStreak = allTasksCompleted ? prev.streak + 1 : prev.streak;

      // Calculate new XP and Level
      const newXp = prev.xp + xpGained;
      const newLevel = Math.floor(newXp / 500) + 1; // Level up every 500 XP

      return {
        ...prev,
        dailyTasks: updatedTasks,
        completedDays,
        streak: newStreak,
        xp: newXp,
        level: newLevel
      };
    });
  };

  const pauseJourney = () => {
    setJourneyState(prev => ({
      ...prev,
      pausedDays: prev.pausedDays + 1
    }));
  };

  const completeJourney = () => {
    setJourneyState(prev => ({
      ...prev,
      currentStep: 'journey-complete'
    }));
  };

  const resetJourney = () => {
    setJourneyState(initialState);
  };

  const addBadge = (badgeName: string) => {
    setJourneyState(prev => ({
      ...prev,
      badges: [...prev.badges, badgeName]
    }));
  };

  const updateSubjectsAndWeakAreas = (subjects: string[], weakAreas: WeakArea[]) => {
    const newTasks = generateDailyTasks(journeyState.goalDuration!, subjects, weakAreas);

    setJourneyState(prev => {
      const updatedDailyTasks = { ...newTasks };

      // Preserve history: Restore tasks for days before currentDay
      for (let d = 1; d < prev.currentDay; d++) {
        if (prev.dailyTasks[d]) {
          updatedDailyTasks[d] = prev.dailyTasks[d];
        }
      }

      return {
        ...prev,
        selectedSubjects: subjects,
        weakAreas: weakAreas,
        dailyTasks: updatedDailyTasks
      };
    });
  };

  return {
    journeyState,
    hasActiveJourney,
    startJourney,
    selectGoal,
    selectSubjectsAndWeakAreas,
    updateSubjectsAndWeakAreas,
    completeTask,
    pauseJourney,
    completeJourney,
    resetJourney,
    addBadge
  };
}

function generateDailyTasks(duration: GoalDuration, subjects: string[], weakAreas: WeakArea[]): Record<number, DailyTask[]> {
  const tasks: Record<number, DailyTask[]> = {};

  for (let day = 1; day <= duration; day++) {
    const subjectIndex = (day - 1) % subjects.length;
    const subject = subjects[subjectIndex];

    tasks[day] = [
      {
        id: `${day}-video`,
        type: 'video',
        title: `${subject} - Video Lesson`,
        description: `Learn core concepts of ${subject}`,
        completed: false,
        duration: 15
      },
      {
        id: `${day}-flashcard`,
        type: 'flashcard',
        title: `${subject} - Flashcards`,
        description: 'Review key terms and formulas',
        completed: false,
        duration: 10
      },
      {
        id: `${day}-quiz`,
        type: 'quiz',
        title: `${subject} - Mini Quiz`,
        description: 'Test your understanding',
        completed: false,
        duration: 15
      },
      {
        id: `${day}-revision`,
        type: 'revision',
        title: 'Revision Task',
        description: 'Review previous day concepts',
        completed: false,
        duration: 10
      },
      {
        id: `${day}-test`,
        type: 'test',
        title: 'Daily Test',
        description: 'Complete daily assessment',
        completed: false,
        duration: 20
      }
    ];
  }

  return tasks;
}
