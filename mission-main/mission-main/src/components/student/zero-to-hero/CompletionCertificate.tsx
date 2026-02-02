import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Download, Share2, TrendingUpDown } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';
import { toast } from '@/hooks/use-toast';

const CompletionCertificate = () => {
  const { journeyState, resetJourney } = useZeroToHero();

  const handleDownloadCertificate = () => {
    toast({
      title: 'Certificate Downloaded! 📄',
      description: 'Your certificate has been saved.',
      type: 'success'
    });
  };

  const handleShare = () => {
    toast({
      title: 'Share Your Achievement! 🎉',
      description: 'Show the world your progress!',
      type: 'success'
    });
  };

  const handleStartNext = () => {
    resetJourney();
    toast({
      title: 'New Journey Started! 🚀',
      description: 'Ready for the next challenge?',
      type: 'success'
    });
  };

  const totalDays = journeyState.goalDuration || 30;
  const completedDays = journeyState.completedDays.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Celebration Banner */}
        <Card className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white border-0">
          <CardContent className="p-12 text-center">
            <Trophy className="h-24 w-24 mx-auto mb-6 text-white" />
            <h1 className="text-5xl font-bold mb-4">🎉 CONGRATULATIONS! 🎉</h1>
            <p className="text-2xl text-yellow-100">
              You've Completed Your Zero to Hero Journey!
            </p>
          </CardContent>
        </Card>

        {/* Certificate */}
        <Card className="border-4 border-yellow-400">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
                <TrendingUpDown className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900">
                Certificate of Achievement
              </h2>
              
              <div className="border-t-2 border-b-2 border-gray-300 py-6 my-6">
                <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
                <p className="text-4xl font-bold text-blue-600 mb-4">Student Name</p>
                <p className="text-lg text-gray-700">has successfully completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-4">
                  {totalDays}-Day Zero to Hero Pathway
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 py-6">
                <div>
                  <p className="text-sm text-gray-600">Journey Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{totalDays} Days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((completedDays / totalDays) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Final Streak</p>
                  <p className="text-2xl font-bold text-orange-600">{journeyState.streak} 🔥</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Insights */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Your Journey Summary
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Subjects Mastered</p>
                <p className="text-lg font-semibold text-gray-900">
                  {journeyState.selectedSubjects.join(', ')}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Weak Areas Improved</p>
                <p className="text-lg font-semibold text-gray-900">
                  {journeyState.weakAreas.reduce((acc, area) => acc + area.topics.length, 0)} Topics
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total Tasks Completed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {completedDays * 5} Tasks
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Badges Earned</p>
                <p className="text-lg font-semibold text-gray-900">
                  {journeyState.badges.length} Achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            size="lg" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleDownloadCertificate}
          >
            <Download className="h-5 w-5 mr-2" />
            Download Certificate
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Achievement
          </Button>
        </div>

        <div className="text-center pt-6">
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleStartNext}
          >
            Start Next Level Journey →
          </Button>
        </div>
      </div>
  );
};

export default CompletionCertificate;
