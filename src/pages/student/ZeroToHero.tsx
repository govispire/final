import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WelcomeScreen from '@/components/student/zero-to-hero/WelcomeScreen';
import GoalSelection from '@/components/student/zero-to-hero/GoalSelection';
import SubjectSelection from '@/components/student/zero-to-hero/SubjectSelection';
import DailyPlan from '@/components/student/zero-to-hero/DailyPlan';
import ProgressDashboard from '@/components/student/zero-to-hero/ProgressDashboard';
import RewardsSection from '@/components/student/zero-to-hero/RewardsSection';
import PeerStudy from '@/components/student/zero-to-hero/PeerStudy';
import FeedbackAI from '@/components/student/zero-to-hero/FeedbackAI';
import CompletionCertificate from '@/components/student/zero-to-hero/CompletionCertificate';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { TrendingUpDown, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import LevelUpModal from '@/components/student/zero-to-hero/LevelUpModal';
import EditSubjectsModal from '@/components/student/zero-to-hero/EditSubjectsModal';

const ZeroToHero = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { journeyState, hasActiveJourney } = useZeroToHero();
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [prevLevel, setPrevLevel] = useState(journeyState.level);

  // Track Level Up
  React.useEffect(() => {
    if (journeyState.level > prevLevel) {
      setShowLevelUpModal(true);
      setPrevLevel(journeyState.level);
    }
  }, [journeyState.level, prevLevel]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <LevelUpModal
        isOpen={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        level={journeyState.level}
        xp={journeyState.xp}
      />
      <EditSubjectsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      {/* Hero Dashboard Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Identity Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center border-2 border-slate-700 shadow-inner">
                  <TrendingUpDown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full border-2 border-slate-900">
                  Lvl {journeyState.level}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white leading-tight">Zero to Hero</h1>
                  {hasActiveJourney && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-400 hover:text-white"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-slate-400">Transform your potential</p>
                {/* XP Bar for Mobile */}
                <div className="mt-2 w-32 md:hidden">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>{journeyState.xp} XP</span>
                    <span>{(journeyState.level * 500)} XP</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${(journeyState.xp % 500) / 500 * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section (Desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {/* XP Progress */}
              <div className="w-48">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span className="font-medium text-blue-400">{journeyState.xp} XP</span>
                  <span>Next Lvl: {(journeyState.level * 500)} XP</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 relative"
                    style={{ width: `${(journeyState.xp % 500) / 500 * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <TrendingUpDown className="h-5 w-5 text-orange-500" /> {/* Using Trending as placeholder for Fire if needed, or import Fire */}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white leading-none">{journeyState.streak}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!hasActiveJourney && journeyState.currentStep === 'welcome' && (
          <WelcomeScreen />
        )}

        {!hasActiveJourney && journeyState.currentStep === 'goal-selection' && (
          <GoalSelection />
        )}

        {!hasActiveJourney && journeyState.currentStep === 'subject-selection' && (
          <SubjectSelection />
        )}

        {journeyState.currentStep === 'journey-complete' && (
          <CompletionCertificate />
        )}

        {hasActiveJourney && journeyState.currentStep !== 'journey-complete' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Mission Control Navigation */}
            <TabsList className="bg-white p-1 shadow-sm rounded-xl border border-gray-200 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="flex-1 min-w-[100px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Daily Plan
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-1 min-w-[100px] data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Map & Progress
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1 min-w-[100px] data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700">
                Rewards
              </TabsTrigger>
              <TabsTrigger value="peer" className="flex-1 min-w-[100px] data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                Peer Study
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex-1 min-w-[100px] data-[state=active]:bg-pink-50 data-[state=active]:text-pink-700">
                AI Feedback
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DailyPlan />
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <ProgressDashboard />
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <RewardsSection />
            </TabsContent>

            <TabsContent value="peer" className="space-y-6">
              <PeerStudy />
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <FeedbackAI />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default ZeroToHero;
