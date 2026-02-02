import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, ThumbsUp, Meh, ThumbsDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const FeedbackAI = () => {
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = () => {
    if (!difficulty) {
      toast({
        title: 'Select Difficulty',
        description: 'Please rate the difficulty level first.',
        type: 'error'
      });
      return;
    }

    toast({
      title: 'Feedback Submitted! 🎉',
      description: 'Thank you for helping us improve your experience.',
      type: 'success'
    });

    setDifficulty(null);
    setFeedback('');
  };

  const aiRecommendations = [
    {
      title: 'Great Progress on Simplification! 🎯',
      message: "You've mastered basic simplification. Ready for the next level?",
      action: 'Try Arithmetic Level 2',
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Reasoning Improvement Needed',
      message: 'Your puzzle-solving accuracy can be improved with practice.',
      action: 'Practice Puzzle Section',
      color: 'from-orange-400 to-red-500'
    },
    {
      title: 'Vocabulary Building Tip',
      message: 'Learning 10 new words daily can boost your score by 15%.',
      action: 'Start Word Challenge',
      color: 'from-blue-400 to-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Feedback Card */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              How would you rate today's difficulty?
            </p>
            <div className="flex gap-4">
              <Button
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setDifficulty('easy')}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                Too Easy
              </Button>
              <Button
                variant={difficulty === 'perfect' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setDifficulty('perfect')}
              >
                <Meh className="h-4 w-4 mr-2" />
                Just Right
              </Button>
              <Button
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setDifficulty('hard')}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Too Hard
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Additional Feedback (Optional)
            </p>
            <Textarea
              placeholder="What would you like to improve? Share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <Button onClick={handleSubmitFeedback} className="w-full">
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Recommendations for You
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiRecommendations.map((rec, index) => (
            <div 
              key={index}
              className="p-4 rounded-xl bg-white border border-gray-200 space-y-3"
            >
              <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${rec.color} text-white text-sm font-medium`}>
                {rec.title}
              </div>
              <p className="text-sm text-gray-700">{rec.message}</p>
              <Button size="sm" variant="outline" className="w-full">
                {rec.action} →
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-900">✓ Strong Areas</p>
            <p className="text-sm text-green-700">Number Systems, Percentages, Grammar</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <p className="text-sm font-medium text-orange-900">⚠ Needs Attention</p>
            <p className="text-sm text-orange-700">Data Interpretation, Puzzles, Vocabulary</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-900">💡 Next Focus</p>
            <p className="text-sm text-blue-700">Time & Work, Blood Relations, Idioms</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackAI;
