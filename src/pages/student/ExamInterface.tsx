
import React from 'react';
import ExamHeader from '@/components/exam/ExamHeader';
import ExamInstructions from '@/components/exam/ExamInstructions';
import ExamSidebar from '@/components/exam/ExamSidebar';
import QuestionContent from '@/components/exam/QuestionContent';
import QuestionPalette from '@/components/exam/QuestionPalette';
import QuestionControls from '@/components/exam/QuestionControls';
import { useExamState } from '@/hooks/useExamState';
import { useExamUI } from '@/hooks/useExamUI';
import { mockQuestions, sections } from '@/data/mockQuestionsData';

interface ExamInterfaceProps {
  isPreview?: boolean;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ isPreview = false }) => {
  const ui = useExamUI();
  const exam = useExamState(mockQuestions, isPreview);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <ExamHeader 
        currentSection={exam.currentQuestion.section}
        isPreview={isPreview}
        formatTime={exam.formatTime}
        timeLeft={exam.timeLeft}
        toggleSidebar={ui.toggleSidebar}
        setShowInstructions={exam.setShowInstructions}
        isMobile={ui.isMobile}
      />
      
      {/* Instructions Modal */}
      <ExamInstructions 
        showInstructions={exam.showInstructions}
        setShowInstructions={exam.setShowInstructions}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sections sidebar */}
        <ExamSidebar 
          showSidebar={ui.showSidebar}
          toggleSidebar={ui.toggleSidebar}
          currentSection={exam.currentQuestion.section}
          sections={sections}
          setCurrentSection={exam.setCurrentSection}
          goToQuestionInSection={exam.goToQuestionInSection}
          isMobile={ui.isMobile}
        />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Sub header */}
          <div className="bg-gray-100 p-2 border-b flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium">{exam.currentSection}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm">Time Left: {exam.formatTime(exam.timeLeft)}</span>
            </div>
          </div>
          
          {/* Section info */}
          <div className="bg-gray-50 p-2 border-b">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm">Question Type: {exam.currentQuestion.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">View in:</span>
                <select 
                  value={exam.language}
                  onChange={(e) => exam.setLanguage(e.target.value)}
                  className="border rounded py-1 px-2 text-sm"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Question content */}
          <QuestionContent 
            currentQuestion={exam.currentQuestion}
            currentQuestionIndex={exam.currentQuestionIndex}
            answers={exam.answers}
            handleAnswerSelect={exam.handleAnswerSelect}
          />
          
          {/* Legend and question palette */}
          {ui.isMobile && (
            <div className="p-2 bg-white border-b flex justify-center">
              <button 
                className="px-4 py-2 w-full rounded border text-sm"
                onClick={ui.toggleQuestionPalette}
              >
                {ui.showQuestionPalette ? 'Hide Question Palette' : 'Show Question Palette'}
              </button>
            </div>
          )}
          
          <QuestionPalette 
            showQuestionPalette={ui.showQuestionPalette}
            toggleQuestionPalette={ui.toggleQuestionPalette}
            isMobile={ui.isMobile}
            currentQuestion={exam.currentQuestion}
            mockQuestions={mockQuestions}
            getQuestionStatus={exam.getQuestionStatus}
            getPaletteStats={exam.getPaletteStats}
            goToQuestion={exam.goToQuestion}
          />
          
          {/* Control buttons */}
          <QuestionControls 
            markForReviewAndNext={exam.markForReviewAndNext}
            clearResponse={exam.clearResponse}
            goToPreviousQuestion={exam.goToPreviousQuestion}
            saveAndNext={exam.saveAndNext}
            handleSubmit={exam.handleSubmit}
            isPreview={isPreview}
          />
          
          {/* Version info */}
          <div className="bg-gray-700 text-white text-xs p-1 text-center">
            {isPreview && <span className="font-bold mr-2">PREVIEW MODE</span>}
            Version: 17.07.00
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
