// components/Questionnaire.tsx
'use client';

import React, { useState } from 'react';

// Define types for our questionnaire data
interface Answer {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface QuestionnaireProps {
  questions: Question[];
  onSubmit?: (responses: Record<string, string[]>) => void;
}

const GenerateQuiz: React.FC<QuestionnaireProps> = ({
  questions,
  onSubmit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

  // Handle checkbox changes
  const handleAnswerChange = (questionId: string, answerId: string) => {
    setResponses(prev => {
      const questionResponses = prev[questionId] || [];
      if (questionResponses.includes(answerId)) {
        return {
          ...prev,
          [questionId]: questionResponses.filter(id => id !== answerId)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...questionResponses, answerId]
        };
      }
    });
  };

  // Handle flag toggle
  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(questionId)) {
        newFlags.delete(questionId);
      } else {
        newFlags.add(questionId);
      }
      return newFlags;
    });
  };

  // Navigation functions
  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(responses);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden bg-white">
        {/* Progress bar */}
        <div className="h-2 bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`p-2 rounded-full ${flaggedQuestions.has(currentQuestion.id) ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                title={flaggedQuestions.has(currentQuestion.id) ? "Unflag this question" : "Flag this question"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
            <div className="space-y-3">
              {currentQuestion.answers.map(answer => (
                <div 
                  key={answer.id} 
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    id={`${currentQuestion.id}-${answer.id}`}
                    checked={(responses[currentQuestion.id] || []).includes(answer.id)}
                    onChange={() => handleAnswerChange(currentQuestion.id, answer.id)}
                    className="h-5 w-5 mr-3 accent-blue-500"
                  />
                  <label 
                    htmlFor={`${currentQuestion.id}-${answer.id}`}
                    className="w-full cursor-pointer"
                  >
                    {answer.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg text-white ${
                currentQuestionIndex === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={goToNext}
                className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateQuiz;