/**
 * Utility function to launch exam in a new fullscreen window
 * Use this for all test/quiz start buttons across the website
 */

interface ExamLaunchParams {
    quizId: string;
    title: string;
    subject: string;
    duration: number;
    questions: number;
}

export const launchExamWindow = (params: ExamLaunchParams) => {
    const { quizId, title, subject, duration, questions } = params;

    // Build URL with query parameters
    const urlParams = new URLSearchParams({
        quizId,
        title,
        subject,
        duration: duration.toString(),
        questions: questions.toString(),
    });

    const examUrl = `/student/exam-window?${urlParams.toString()}`;

    // Open in new window with specific dimensions
    const windowFeatures = 'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no';
    const examWindow = window.open(examUrl, '_blank', windowFeatures);

    if (examWindow) {
        examWindow.focus();

        // Listen for exam completion
        const checkResult = setInterval(() => {
            const result = localStorage.getItem('exam_result_' + quizId);
            if (result) {
                clearInterval(checkResult);
                localStorage.removeItem('exam_result_' + quizId);

                // Trigger callback or refresh parent page
                const parsedResult = JSON.parse(result);

                // Store in quiz completions
                const completions = JSON.parse(localStorage.getItem('quizCompletions') || '{}');
                completions[quizId] = {
                    completed: true,
                    score: parsedResult.score,
                    date: new Date().toISOString()
                };
                localStorage.setItem('quizCompletions', JSON.stringify(completions));

                // Reload parent page to show updated status
                window.location.reload();
            }
        }, 1000);

        // Clear interval if window is closed without completion
        setTimeout(() => clearInterval(checkResult), duration * 60 * 1000 + 60000);
    } else {
        alert('Please allow popups for this website to start the exam');
    }
};

export default launchExamWindow;
