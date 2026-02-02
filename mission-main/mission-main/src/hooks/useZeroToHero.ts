import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type JourneyStep = 'welcome' | 'introduction' | 'topic-selection' | 'active-journey' | 'journey-complete';

export interface TopicResource {
  id: string;
  type: 'video' | 'test' | 'pdf';
  title: string;
  url: string;
  duration?: number;
  completed: boolean;
  completedAt?: string;
}

export interface Chapter {
  id: string;
  subject: string;
  subjectIcon?: string;
  topicId: string;
  topicName: string;
  resources: {
    videos: TopicResource[];
    tests: TopicResource[];
    pdfs: TopicResource[];
  };
  completionPercentage: number;
  unlocked: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface DailyPlan {
  dayNumber: number;
  date: string;
  chapters: Chapter[];
  allCompleted: boolean;
  unlocked: boolean;
}

export interface SelectedTopic {
  subject: string;
  subjectIcon?: string;
  topicIds: string[];
  topicNames: string[];
}

export interface JourneyState {
  currentStep: JourneyStep;
  hasSeenIntroduction: boolean;
  selectedExam: string;
  selectedSubjects: string[];
  selectedTopics: SelectedTopic[];
  currentDayIndex: number;
  dailyPlans: DailyPlan[];
  currentChapterSet: number;
  totalChapterSets: number;
  startDate: string | null;
  completedDays: number[];
}

const initialState: JourneyState = {
  currentStep: 'welcome',
  hasSeenIntroduction: false,
  selectedExam: '',
  selectedSubjects: [],
  selectedTopics: [],
  currentDayIndex: 0,
  dailyPlans: [],
  currentChapterSet: 0,
  totalChapterSets: 0,
  startDate: null,
  completedDays: [],
};

export function useZeroToHero() {
  const [journeyState, setJourneyState] = useLocalStorage<JourneyState>('zero_to_hero_journey_v2', initialState);

  const hasActiveJourney = journeyState.currentStep === 'active-journey' && journeyState.dailyPlans.length > 0;

  const startJourney = () => {
    setJourneyState(prev => ({
      ...prev,
      currentStep: journeyState.hasSeenIntroduction ? 'topic-selection' : 'introduction'
    }));
  };

  const completeIntroduction = () => {
    setJourneyState(prev => ({
      ...prev,
      hasSeenIntroduction: true,
      currentStep: 'topic-selection'
    }));
  };

  const skipIntroduction = () => {
    setJourneyState(prev => ({
      ...prev,
      hasSeenIntroduction: true,
      currentStep: 'topic-selection'
    }));
  };

  const selectTopicsAndGeneratePlan = (exam: string, selectedTopics: SelectedTopic[]) => {
    const startDate = new Date().toISOString();
    const dailyPlans = generateDailyPlans(selectedTopics);

    setJourneyState(prev => ({
      ...prev,
      selectedExam: exam,
      selectedTopics: selectedTopics,
      selectedSubjects: selectedTopics.map(t => t.subject),
      startDate: startDate,
      currentStep: 'active-journey',
      currentDayIndex: 0,
      dailyPlans: dailyPlans,
      totalChapterSets: dailyPlans.length
    }));
  };

  const completeResource = (dayIndex: number, chapterId: string, resourceId: string) => {
    setJourneyState(prev => {
      const updatedPlans = [...prev.dailyPlans];
      const dayPlan = updatedPlans[dayIndex];

      if (!dayPlan) return prev;

      let allChaptersCompleted = false;

      // Update the specific chapter's resource
      dayPlan.chapters = dayPlan.chapters.map(chapter => {
        if (chapter.id !== chapterId) return chapter;

        const updatedChapter = { ...chapter };
        const updateResources = (resources: TopicResource[]) =>
          resources.map(r => {
            if (r.id === resourceId && !r.completed) {
              return { ...r, completed: true, completedAt: new Date().toISOString() };
            }
            return r;
          });

        updatedChapter.resources = {
          videos: updateResources(chapter.resources.videos),
          tests: updateResources(chapter.resources.tests),
          pdfs: updateResources(chapter.resources.pdfs)
        };

        // Calculate completion percentage
        const totalResources = 35; // 5 videos + 20 tests + 10 pdfs
        const completedResources = [
          ...updatedChapter.resources.videos,
          ...updatedChapter.resources.tests,
          ...updatedChapter.resources.pdfs
        ].filter(r => r.completed).length;

        updatedChapter.completionPercentage = Math.round((completedResources / totalResources) * 100);

        // Check if chapter just completed
        if (updatedChapter.completionPercentage === 100 && !chapter.completedAt) {
          updatedChapter.completedAt = new Date().toISOString();
        }

        if (!updatedChapter.startedAt && completedResources > 0) {
          updatedChapter.startedAt = new Date().toISOString();
        }

        return updatedChapter;
      });

      // Check if all chapters in this day are completed
      allChaptersCompleted = dayPlan.chapters.every(ch => ch.completionPercentage === 100);

      if (allChaptersCompleted && !dayPlan.allCompleted) {
        dayPlan.allCompleted = true;

        // Unlock next day
        if (updatedPlans[dayIndex + 1]) {
          updatedPlans[dayIndex + 1].unlocked = true;
          updatedPlans[dayIndex + 1].chapters = updatedPlans[dayIndex + 1].chapters.map(ch => ({
            ...ch,
            unlocked: true
          }));
        }
      }

      // Update completed days
      const completedDays = allChaptersCompleted && !prev.completedDays.includes(dayIndex)
        ? [...prev.completedDays, dayIndex]
        : prev.completedDays;

      return {
        ...prev,
        dailyPlans: updatedPlans,
        completedDays,
        currentDayIndex: allChaptersCompleted ? Math.min(dayIndex + 1, updatedPlans.length - 1) : prev.currentDayIndex
      };
    });
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

  const updateTopicsAndRegeneratePlan = (selectedTopics: SelectedTopic[]) => {
    const dailyPlans = generateDailyPlans(selectedTopics);

    setJourneyState(prev => ({
      ...prev,
      selectedTopics: selectedTopics,
      selectedSubjects: selectedTopics.map(t => t.subject),
      dailyPlans: dailyPlans,
      totalChapterSets: dailyPlans.length,
      currentDayIndex: 0
    }));
  };

  return {
    journeyState,
    hasActiveJourney,
    startJourney,
    completeIntroduction,
    skipIntroduction,
    selectTopicsAndGeneratePlan,
    completeResource,
    completeJourney,
    resetJourney,
    updateTopicsAndRegeneratePlan
  };
}

// Generate daily plans based on selected weak areas
function generateDailyPlans(selectedTopics: SelectedTopic[]): DailyPlan[] {
  const plans: DailyPlan[] = [];

  // Find the maximum number of topics across all subjects
  const maxTopics = Math.max(...selectedTopics.map(st => st.topicIds.length));

  // Generate one day for each "chapter set" (round-robin across subjects)
  for (let chapterSetIndex = 0; chapterSetIndex < maxTopics; chapterSetIndex++) {
    const chapters: Chapter[] = [];

    selectedTopics.forEach((subjectTopics, subjectIndex) => {
      // Only add chapter if this subject has a topic at this index
      if (chapterSetIndex < subjectTopics.topicIds.length) {
        const topicId = subjectTopics.topicIds[chapterSetIndex];
        const topicName = subjectTopics.topicNames[chapterSetIndex];

        const chapter: Chapter = {
          id: `chapter-${subjectIndex}-${chapterSetIndex}`,
          subject: subjectTopics.subject,
          subjectIcon: subjectTopics.subjectIcon,
          topicId: topicId,
          topicName: topicName,
          resources: generateChapterResources(topicName, subjectTopics.subject),
          completionPercentage: 0,
          unlocked: chapterSetIndex === 0, // Only first set unlocked
        };

        chapters.push(chapter);
      }
    });

    if (chapters.length > 0) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + chapterSetIndex);

      plans.push({
        dayNumber: chapterSetIndex + 1,
        date: dayDate.toISOString(),
        chapters: chapters,
        allCompleted: false,
        unlocked: chapterSetIndex === 0
      });
    }
  }

  return plans;
}

// Generate 35 resources per chapter (5 videos, 20 tests, 10 PDFs)
function generateChapterResources(topicName: string, subject: string): Chapter['resources'] {
  const videos: TopicResource[] = Array.from({ length: 5 }, (_, i) => ({
    id: `video-${topicName}-${i}`,
    type: 'video',
    title: `${topicName} - ${getVideoTitle(i)}`,
    url: `/resources/videos/${subject}/${topicName}/${i}`,
    duration: 10 + Math.floor(Math.random() * 10),
    completed: false
  }));

  const tests: TopicResource[] = Array.from({ length: 20 }, (_, i) => ({
    id: `test-${topicName}-${i}`,
    type: 'test',
    title: `${topicName} - ${getTestTitle(i)}`,
    url: `/student/test/${subject}-${topicName}-${i}`,
    completed: false
  }));

  const pdfs: TopicResource[] = Array.from({ length: 10 }, (_, i) => ({
    id: `pdf-${topicName}-${i}`,
    type: 'pdf',
    title: `${topicName} - ${getPdfTitle(i)}`,
    url: `/resources/pdfs/${subject}/${topicName}/${i}.pdf`,
    completed: false
  }));

  return { videos, tests, pdfs };
}

function getVideoTitle(index: number): string {
  const titles = [
    'Introduction & Concepts',
    'Formulas & Shortcuts',
    'Problem Solving Techniques',
    'Advanced Concepts',
    'Tricks & Time Savers'
  ];
  return titles[index] || `Video Lesson ${index + 1}`;
}

function getTestTitle(index: number): string {
  if (index < 5) return `Basic Practice ${index + 1}`;
  if (index < 10) return `Intermediate Test ${index - 4}`;
  if (index < 15) return `Advanced Practice ${index - 9}`;
  return `Mock Test ${index - 14}`;
}

function getPdfTitle(index: number): string {
  const titles = [
    'Quick Notes',
    'Formula Sheet',
    'Important Questions',
    'Previous Year Paper 1',
    'Previous Year Paper 2',
    'Practice Problems Set 1',
    'Practice Problems Set 2',
    'Solved Examples',
    'Shortcut Tricks',
    'Revision Notes'
  ];
  return titles[index] || `Study Material ${index + 1}`;
}
