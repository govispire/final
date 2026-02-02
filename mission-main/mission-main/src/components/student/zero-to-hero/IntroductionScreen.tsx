import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    BookOpen,
    Lock,
    Unlock,
    TrendingUp,
    Target,
    Award,
    CheckCircle2,
    Zap,
    BarChart3
} from 'lucide-react';
import { useZeroToHero } from '@/hooks/useZeroToHero';

const IntroductionScreen = () => {
    const { completeIntroduction, skipIntroduction } = useZeroToHero();

    const features = [
        {
            icon: Target,
            title: 'Personalized Learning',
            description: 'Select only the topics you struggle with - focus on your weak areas',
            color: 'text-blue-600 bg-blue-100'
        },
        {
            icon: BarChart3,
            title: 'Multi-Subject Rotation',
            description: 'Study different subjects daily to prevent burnout and maintain focus',
            color: 'text-purple-600 bg-purple-100'
        },
        {
            icon: Lock,
            title: 'Sequential Unlocking',
            description: 'Complete all resources in current chapters to unlock the next day',
            color: 'text-orange-600 bg-orange-100'
        },
        {
            icon: BookOpen,
            title: 'Comprehensive Resources',
            description: '5 videos, 20 tests, and 10 PDFs per chapter - everything you need',
            color: 'text-green-600 bg-green-100'
        }
    ];

    const howItWorks = [
        {
            step: 1,
            title: 'Select Your Weak Areas',
            description: 'Choose subjects and specific topics you want to master',
            icon: CheckCircle2
        },
        {
            step: 2,
            title: 'Get Your Daily Plan',
            description: 'Each day covers one chapter from each subject you selected',
            icon: TrendingUp
        },
        {
            step: 3,
            title: 'Complete All Resources',
            description: 'Finish all 35 resources (videos, tests, PDFs) in each chapter',
            icon: Zap
        },
        {
            step: 4,
            title: 'Unlock Next Day',
            description: 'Once all chapters are done, the next day automatically unlocks',
            icon: Unlock
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 py-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
                    <Award className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900">
                    Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Zero to Hero</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A structured, disciplined pathway to strengthen your weak areas and master competitive exams
                </p>
            </div>

            {/* What is Zero to Hero? */}
            <Card>
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Zero to Hero?</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Zero to Hero is a personalized learning system designed for students preparing for competitive exams.
                        Instead of overwhelming you with entire syllabi, we help you focus on <span className="font-semibold text-blue-600">your specific weak areas</span>.
                        By combining multi-subject daily rotation with sequential unlocking, we ensure you:
                    </p>
                    <ul className="mt-4 space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Stay focused without subject fatigue</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Complete comprehensive resources for deep understanding</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Build discipline through structured progression</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Transform weak areas into strengths systematically</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Key Features */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why It Works</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* How It Works */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {howItWorks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="text-center">
                                    <div className="relative inline-flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-blue-600 shadow-lg">
                                            <Icon className="h-7 w-7 text-blue-600" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Example Day Box */}
            <Card className="border-2 border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Example Day Plan
                    </h3>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                            <div className="font-medium text-gray-900">📊 Quantitative Aptitude - Time and Work</div>
                            <div className="text-sm text-gray-600 mt-1">5 videos • 20 tests • 10 PDFs</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                            <div className="font-medium text-gray-900">🧠 Reasoning - Puzzle</div>
                            <div className="text-sm text-gray-600 mt-1">5 videos • 20 tests • 10 PDFs</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-blue-200">
                            <div className="font-medium text-gray-900">📝 English - Grammar</div>
                            <div className="text-sm text-gray-600 mt-1">5 videos • 20 tests • 10 PDFs</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                        Complete all resources → Day 2 unlocks automatically!
                    </p>
                </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 text-lg"
                    onClick={completeIntroduction}
                >
                    Get Started
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={skipIntroduction}
                >
                    Skip Introduction
                </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
                You won't see this introduction again after proceeding
            </p>
        </div>
    );
};

export default IntroductionScreen;
