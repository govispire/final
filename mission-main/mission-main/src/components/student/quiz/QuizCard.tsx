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

// Simplified to single primary gradient for all types
const TYPE_GRADIENT = 'from-primary to-primary/80';

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
            case 'Easy': return 'bg-muted text-foreground';
            case 'Medium': return 'bg-muted text-foreground';
            case 'Hard': return 'bg-muted text-foreground';
            default: return 'bg-muted text-foreground';
        }
    };

    return (
        <>
            <Card
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 min-h-[280px] ${isCompleted ? 'border-2 border-green-500/30' : ''
                    } ${isDisabled ? 'opacity-60' : ''}`}
            >
                {/* Gradient Background Overlay */}
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${TYPE_GRADIENT} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Top Stripe */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${TYPE_GRADIENT}`} />

                <CardContent className="relative p-5">
                    {/* Attempted Badge - Top Right Corner */}
                    <div className="absolute top-0 right-0 bg-muted/80 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-bl-lg rounded-tr-lg shadow-md">
                        <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-xs font-semibold">{quiz.totalUsers?.toLocaleString() || 0} attempted</span>
                        </div>
                    </div>

                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 mb-5 mt-6">
                        <div className="flex items-center gap-2">
                            {/* Type Icon */}
                            <div
                                className={`p-2 rounded-xl bg-gradient-to-br ${TYPE_GRADIENT} text-white shadow-lg`}
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

                        {/* NEW Badge */}
                        {quiz.isNew && quiz.scheduledDate === todayStr && !isCompleted && (
                            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white px-2 py-0.5 text-[10px] font-bold animate-pulse">
                                <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                NEW
                            </Badge>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-lg">
                            <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Questions</p>
                                <p className="font-bold text-xs">{quiz.questions}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-lg">
                            <Award className="h-3.5 w-3.5 text-muted-foreground" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Marks</p>
                                <p className="font-bold text-xs">{quiz.questions * 2}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 p-2 bg-muted/30 rounded-lg">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <div>
                                <p className="text-[10px] text-muted-foreground">Duration</p>
                                <p className="font-bold text-xs">{quiz.duration} mins</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full">
                        {isCompleted ? (
                            <>
                                <>
                                    <Button
                                        variant="outline"
                                        onClick={() => onStart(quiz)}
                                        className="h-9 w-9 p-0 rounded-lg border-2 hover:bg-primary/5 shrink-0"
                                        title="Retake Quiz"
                                    >
                                        <Play className="h-4 w-4 fill-current" />
                                    </Button>
                                    <Button
                                        onClick={() => setShowLeaderboard(true)}
                                        className="flex-1 h-9 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/90 flex items-center justify-center"
                                    >
                                        <Trophy className="h-3.5 w-3.5 mr-1.5" />
                                        Analyse
                                    </Button>
                                </>
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
