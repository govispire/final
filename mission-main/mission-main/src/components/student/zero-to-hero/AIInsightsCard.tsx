import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Lightbulb, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIInsightsCardProps {
    subject: string;
    day: number;
}

const AIInsightsCard = ({ subject, day }: AIInsightsCardProps) => {
    // Mock AI Logic to generate context-aware insights
    const getInsight = () => {
        const insights = [
            {
                type: 'strategy',
                icon: Target,
                title: 'Why this focus?',
                text: `Your performance data suggests ${subject} is a high-leverage area. Improving here will boost your overall rank by ~15%.`
            },
            {
                type: 'tip',
                icon: Lightbulb,
                title: 'Study Tip',
                text: `For ${subject}, try the "Feynman Technique" today: explain the core concept out loud as if teaching a beginner.`
            },
            {
                type: 'motivation',
                icon: Sparkles,
                title: 'Momentum',
                text: `You've crushed 3 days in a row! Today's ${subject} module is designed to be lighter to help you recover while maintaining the streak.`
            }
        ];

        // reliable deterministic "random" based on day
        return insights[day % insights.length];
    };

    const insight = getInsight();
    const Icon = insight.icon;

    return (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
            <CardContent className="p-4">
                <div className="flex bg-white/60 p-3 rounded-xl gap-4 items-start backdrop-blur-sm">
                    <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                        <Icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-100 rounded-full uppercase tracking-wider">
                                AI Insight
                            </span>
                            <h4 className="font-semibold text-gray-900 text-sm">{insight.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {insight.text}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default AIInsightsCard;
