import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Clock, Play, CheckCircle, Lock, Calendar as CalendarIcon,
    Trophy, Zap, Users, Rocket, BookOpen, Target, Award,
    TrendingUp, Sparkles
} from 'lucide-react';
import { ExtendedQuiz, QuizType } from '@/types/quizTypes';
import QuizLeaderboardModal from './QuizLeaderboardModal';
import { getQuizLeaderboard } from '@/services/quizLeaderboardService';

interface QuizCardProps {
    quiz: ExtendedQuiz;
    onStart: (quiz: ExtendedQuiz) => void;
    todayStr: string;
}

const TYPE_ICONS: Record<QuizType, React.ReactNode> = {
    'daily': <CalendarIcon className="h-5 w-5" />,
    'rapid-fire': <Zap className="h-5 w-5" />,
    'speed-challenge': <Rocket className="h-5 w-5" />,
    'mini-test': <BookOpen className="h-5 w-5" />,
    'sectional': <Target className="h-5 w-5" />,
    'full-prelims': <Award className="h-5 w-5" />,
    'full-mains': <Trophy className="h-5 w-5" />,
};

const TYPE_GRADIENTS: Record<QuizType, string> = {
    'daily': 'from-blue-500 to-blue-600',
    'rapid-fire': 'from-orange-500 to-orange-600',
    'speed-challenge': 'from-red-500 to-red-600',
    'mini-test': 'from-green-500 to-green-600',
    'sectional': 'from-purple-500 to-purple-600',
    'full-prelims': 'from-yellow-500 to-yellow-600',
    'full-mains': 'from-indigo-500 to-indigo-600',
};

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart, todayStr }) => {
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const isLocked = quiz.isLocked;
    const isFuture = quiz.scheduledDate > todayStr;
    const isCompleted = quiz.completed;
    const isDisabled = isLocked || isFuture;

    const leaderboard = isCompleted
        ? getQuizLeaderboard(quiz.id, quiz.title, { score: quiz.score || 0, timeTaken: quiz.duration * 60 * 0.7 })
        : getQuizLeaderboard(quiz.id, quiz.title);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-emerald-500 text-white';
            case 'Medium': return 'bg-amber-500 text-white';
            case 'Hard': return 'bg-rose-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    return (
        <>
            <Card
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isCompleted ? 'border-2 border-green-500/30' : ''
                    } ${isDisabled ? 'opacity-60' : ''}`}
            >
                {/* Gradient Background Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${TYPE_GRADIENTS[quiz.type]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Top Stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${TYPE_GRADIENTS[quiz.type]}`} />

                <CardContent className="relative p-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            {/* Type Icon */}
                            <div
                                className={`p-2 rounded-xl bg-gradient-to-br ${TYPE_GRADIENTS[quiz.type]} text-white shadow-lg`}
                            >
                                {TYPE_ICONS[quiz.type]}
                            </div>

                            <div>
                                <h3 className="font-bold text-sm mb-0.5">{quiz.title}</h3>
                                <div className="flex items-center gap-1 flex-wrap">
                                    <Badge variant="outline" className="text-[10px] capitalize py-0 px-1.5">
                                        {quiz.type.replace('-', ' ')}
                                    </Badge>
                                    {quiz.examLevel && (
                                        <Badge className="text-[10px] uppercase bg-primary/10 text-primary border-primary/20 py-0 px-1.5">
                                            {quiz.examLevel}
                                        </Badge>
                                    )}
                                    <Badge className={`text-[10px] font-bold py-0 px-1.5 ${getDifficultyColor(quiz.difficulty)}`}>
                                        {quiz.difficulty}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* NEW Badge or Completion */}
                        {quiz.isNew && quiz.scheduledDate === todayStr && !isCompleted && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-2 py-0.5 text-[10px] font-bold animate-pulse">
                                <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                NEW
                            </Badge>
                        )}
                        {isCompleted && (
                            <div className="text-center px-2 py-1 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-500/30">
                                <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-0.5" />
                                <p className="text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    {quiz.score}%
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-lg">
                            <Trophy className="h-3.5 w-3.5 text-primary" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Questions</p>
                                <p className="font-bold text-xs">{quiz.questions}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-orange-500" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Duration</p>
                                <p className="font-bold text-xs">{quiz.duration} mins</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-lg">
                            <Users className="h-3.5 w-3.5 text-green-500" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Attempted</p>
                                <p className="font-bold text-xs">{quiz.totalUsers?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Top 3 Leaderboard Preview */}
                    {leaderboard.topByScore.slice(0, 3).length > 0 && (
                        <div className="mb-3 p-2 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between mb-1.5">
                                <h4 className="text-[10px] font-bold text-primary flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    Top Performers
                                </h4>
                                <span className="text-[10px] text-muted-foreground">
                                    {leaderboard.totalParticipants.toLocaleString()} total
                                </span>
                            </div>
                            <div className="space-y-1">
                                {leaderboard.topByScore.slice(0, 3).map((entry, index) => (
                                    <div key={index} className="flex items-center gap-1.5 text-[10px]">
                                        <span className="font-bold w-3">#{index + 1}</span>
                                        <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">
                                            {entry.avatar}
                                        </div>
                                        <span className="flex-1 truncate font-medium text-[10px]">{entry.userName}</span>
                                        <span className="font-bold text-primary text-[10px]">{entry.score}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {isCompleted ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => onStart(quiz)}
                                    className="flex-1 h-9 rounded-lg font-semibold text-xs border-2 hover:bg-primary/5"
                                >
                                    <Play className="h-3.5 w-3.5 mr-1.5" />
                                    Retake
                                </Button>
                                <Button
                                    onClick={() => setShowLeaderboard(true)}
                                    className="flex-1 h-9 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/90"
                                >
                                    <Trophy className="h-3.5 w-3.5 mr-1.5" />
                                    Leaderboard
                                </Button>
                            </>
                        ) : isLocked ? (
                            <Button
                                disabled
                                variant="outline"
                                className="w-full h-9 rounded-lg font-semibold text-xs"
                            >
                                <Lock className="h-3.5 w-3.5 mr-1.5" />
                                Locked
                            </Button>
                        ) : isFuture ? (
                            <Button
                                disabled
                                variant="outline"
                                className="w-full h-9 rounded-lg font-semibold text-xs"
                            >
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                Coming Soon
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={() => setShowLeaderboard(true)}
                                    variant="outline"
                                    className="h-9 px-3 rounded-lg font-semibold border-2"
                                >
                                    <Trophy className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    onClick={() => onStart(quiz)}
                                    className="flex-1 h-9 rounded-lg font-semibold text-xs shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                                >
                                    <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
                                    Start Now
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Leaderboard Modal */}
            <QuizLeaderboardModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                leaderboard={leaderboard}
            />
        </>
    );
};

export default QuizCard;
