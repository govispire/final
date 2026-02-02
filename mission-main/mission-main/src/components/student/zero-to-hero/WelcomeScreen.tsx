import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, Zap, Award, Sparkles } from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

const WelcomeScreen = () => {
  const { startJourney } = useZeroToHero();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-lg mb-4">
          <TrendingUp className="h-12 w-12 text-white" />
        </div>

        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Welcome to the{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Zero to Hero Pathway
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A personalized, disciplined learning system designed to transform your weak areas into strengths.
        </p>
      </div>

      {/* Key Benefits */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus on Your Weak Areas</h3>
            <p className="text-gray-600">
              Select only the topics you struggle with. No need to study everything - just focus on what you need to improve.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Subject Daily Rotation</h3>
            <p className="text-gray-600">
              Study different subjects each day to prevent burnout and maintain focus. Variety keeps learning interesting!
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Resources</h3>
            <p className="text-gray-600">
              Each chapter includes 5 videos, 20 practice tests, and 10 PDFs - everything you need to master the topic.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Progress</h3>
            <p className="text-gray-600">
              Sequential unlocking ensures you complete each day before moving forward. Build discipline and consistency!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Select Your Weak Topics</h3>
                <p className="text-gray-600 text-sm">Choose subjects and specific topics you want to improve</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Get Your Personalized Plan</h3>
                <p className="text-gray-600 text-sm">We create daily plans with one chapter from each subject</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Complete Resources Daily</h3>
                <p className="text-gray-600 text-sm">Work through videos, tests, and PDFs for each chapter</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Unlock Next Day</h3>
                <p className="text-gray-600 text-sm">Complete all chapters to unlock the next day's plan</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-16 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          onClick={startJourney}
        >
          Start Your Journey
        </Button>

        <p className="text-sm text-gray-500">
          Transform your weak areas into strengths with structured learning
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
