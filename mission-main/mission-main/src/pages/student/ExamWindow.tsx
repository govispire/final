import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ExamInstructions } from '@/components/student/exam/ExamInstructions';
import { ExamInterface } from '@/components/student/exam/ExamInterface';
import { ExamConfig } from '@/types/exam';
import { getQuestionsForQuiz } from '@/data/quizQuestionsData';
import { toast } from 'sonner';

// This is a standalone fullscreen exam page that opens in a new window
const ExamWindow = () => {
    const [searchParams] = useSearchParams();
    const [showInstructions, setShowInstructions] = React.useState(true);
    const [startTime] = React.useState(Date.now());

    // Get quiz data from URL parameters
    const quizId = searchParams.get('quizId') || '';
    const quizTitle = searchParams.get('title') || 'Exam';
    const subject = searchParams.get('subject') || 'General';
    const duration = parseInt(searchParams.get('duration') || '30');
    const questionCount = parseInt(searchParams.get('questions') || '10');

    // Enter fullscreen on mount
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                console.log('Fullscreen not supported or denied');
            }
        };
        enterFullscreen();

        // Prevent accidental navigation
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!showInstructions) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave the exam?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [showInstructions]);

    // Get questions
    const questions = getQuestionsForQuiz(subject, questionCount);

    // Convert to exam format
    const examConfig: ExamConfig = {
        id: quizId,
        title: quizTitle,
        totalDuration: duration,
        languages: ['English'],
        instructions: [],
        sections: [
            {
                id: 'main-section',
                name: subject,
                questionsCount: questions.length,
                questions: questions.map((q, index) => ({
                    id: q.id,
                    sectionId: 'main-section',
                    sectionName: subject,
                    questionNumber: index + 1,
                    type: 'mcq' as const,
                    question: q.text,
                    options: q.options.map((opt, i) => ({
                        id: `opt-${index}-${i}`,
                        text: opt
                    })),
                    correctAnswer: `opt-${index}-${q.correctAnswer}`,
                    marks: 1,
                    negativeMarks: 0.25,
                    explanation: q.explanation,
                })),
            }
        ]
    };

    const handleSubmit = (responses: Record<string, string | string[] | null>) => {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        let correctCount = 0;
        let incorrectCount = 0;
        let notAttempted = 0;

        questions.forEach((q, index) => {
            const examQuestion = examConfig.sections[0].questions[index];
            const selected = responses[examQuestion.id];

            let selectedIndex: number | null = null;
            if (selected && typeof selected === 'string') {
                const parts = selected.split('-');
                selectedIndex = parseInt(parts[2]);
            }

            if (selectedIndex === null) {
                notAttempted++;
            } else if (selectedIndex === q.correctAnswer) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);

        // Store result in localStorage for parent window to retrieve
        const result = {
            quizId,
            score,
            totalQuestions: questions.length,
            correctAnswers: correctCount,
            wrongAnswers: incorrectCount,
            unanswered: notAttempted,
            timeTaken,
        };

        localStorage.setItem('exam_result_' + quizId, JSON.stringify(result));

        toast.success('Exam Submitted Successfully!', {
            description: `Score: ${score}% | Correct: ${correctCount} | Wrong: ${incorrectCount}`
        });

        // Exit fullscreen and close window
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        setTimeout(() => {
            window.close();
        }, 2000);
    };

    if (showInstructions) {
        return (
            <ExamInstructions
                examConfig={examConfig}
                onComplete={() => setShowInstructions(false)}
            />
        );
    }

    return (
        <ExamInterface
            examConfig={examConfig}
            onSubmit={handleSubmit}
            userName="Student"
        />
    );
};

export default ExamWindow;
