import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IntroductionScreen from '@/components/student/zero-to-hero/IntroductionScreen';
import WelcomeScreen from '@/components/student/zero-to-hero/WelcomeScreen';
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

import EditSubjectsModal from '@/components/student/zero-to-hero/EditSubjectsModal';

const ZeroToHero = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { journeyState, hasActiveJourney } = useZeroToHero();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <EditSubjectsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      {/* Hero Dashboard Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Identity Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center border-2 border-slate-700 shadow-inner">
                  <TrendingUpDown className="h-8 w-8 text-white" />
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
                <p className="text-sm text-slate-400">Transform your weaknesses to strengths</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Screen */}
        {!hasActiveJourney && journeyState.currentStep === 'welcome' && (
          <WelcomeScreen />
        )}

        {/* Introduction Screen */}
        {!hasActiveJourney && journeyState.currentStep === 'introduction' && (
          <IntroductionScreen />
        )}

        {/* Topic Selection */}
        {!hasActiveJourney && journeyState.currentStep === 'topic-selection' && (
          <SubjectSelection />
        )}

        {/* Completion Certificate */}
        {journeyState.currentStep === 'journey-complete' && (
          <CompletionCertificate />
        )}

        {/* Active Journey */}
        {hasActiveJourney && journeyState.currentStep !== 'journey-complete' && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Mission Control Navigation */}
            <TabsList className="bg-white p-1 shadow-sm rounded-xl border border-gray-200 w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="flex-1 min-w-[100px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Daily Plan
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-1 min-w-[100px] data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                Progress
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
