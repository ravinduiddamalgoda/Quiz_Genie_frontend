'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore, useQuizStore } from '@/store/useStore';

import SideDrawer from '@/component/sideDrawer';

interface QuizOption {
  id: string;
  text: string;
}

interface Question {
  id: number;
  text: string;
  options: QuizOption[];
  correctAnswer: string;
  difficulty: string;
  language: string;
  tags?: string[];
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  totalQuestions: number;
  tags?: string[];
  category?: string;
  description?: string;
  difficultyLevel?: number;
  language: string;
}

interface QuizSubmissionResult {
  success: boolean;
  message: string;
  attempt: {
    _id: string;
    score: number;
    timeTaken: number;
    responses: Array<{
      question: string;
      selectedOptions: string[];
      isCorrect: boolean;
    }>;
    incorrectTopics: string[];
    completedAt: string;
  };
}

interface QuestionResponse {
  question: number;
  selectedOption: number;
  isCorrect: boolean;
}

const QuizPlayAction: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizResult, setQuizResult] = useState<QuizSubmissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  // Get quiz state and actions from Zustand store
  const { 
    currentQuiz, 
    currentAttempt,
    setCurrentQuiz,
    startQuizAttempt,
    setQuestionResponse,
    finishQuizAttempt,
    clearCurrentQuiz,
    addToRecentQuizzes
  } = useQuizStore();
  
  const quizId = useQuizStore((state) => state.currentQuiz?.id);

  useEffect(() => {
    // Set start time when component mounts
    setStartTime(new Date());
    
    const fetchQuiz = async () => {
      if (!quizId) {
        setError('No quiz ID provided');
        setIsLoading(false);
        return;
      }

      // If we already have this quiz in the store, use it
      if (currentQuiz && currentQuiz.id === quizId) {
        if (!currentAttempt) {
          // Start a new attempt if there's no current one
          startQuizAttempt(quizId);
        }
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3600/api/quiz/${quizId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const data = await response.json();

        if (data.quiz) {
          // Format quiz to match our interface
          const formattedQuiz: Quiz = {
            id: data.quiz._id,
            title: data.quiz.title,
            questions: data.quiz.questions.map((q: any, index: number) => ({
              id: index + 1,
              text: q.text,
              options: q.options.map((opt: any, i: number) => ({
                id: String.fromCharCode(65 + i), // A, B, C, D...
                text: opt.text
              })),
              correctAnswer: String.fromCharCode(65 + q.options.findIndex((opt: any) => opt.isCorrect)),
              difficulty: q.difficultyLevel <= 2 ? 'easy' : q.difficultyLevel <= 4 ? 'medium' : 'hard',
              language: q.language || data.quiz.language,
              tags: q.tags,
              explanation: q.explanation
            })),
            totalQuestions: data.quiz.questions.length,
            tags: data.quiz.tags,
            category: data.quiz.category,
            description: data.quiz.description,
            difficultyLevel: data.quiz.difficultyLevel,
            language: data.quiz.language
          };
          
          // Save quiz in the store
          setCurrentQuiz(formattedQuiz);
          
          // Start a new attempt
          startQuizAttempt(quizId);
          
          // Add to recent quizzes list
          addToRecentQuizzes(quizId);
        } else {
          throw new Error('Quiz data not found in response');
        }
      } catch (error: any) {
        console.error('Error fetching quiz:', error);
        setError(error.message || 'Failed to load quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token && quizId) {
      fetchQuiz();
    }
  }, [
    quizId, 
    token, 
    currentQuiz, 
    currentAttempt, 
    setCurrentQuiz, 
    startQuizAttempt, 
    addToRecentQuizzes
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-xl text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="mb-4">{error || 'Quiz not found'}</p>
          <button 
            onClick={() => router.push('/generateQuiz')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentIndex];
  const isFinished = quizResult !== null;

  // Get the selected answer for the current question from the store
  const currentAnswer = currentAttempt ? currentAttempt.responses[currentQuestion.id] : undefined;

  const handleSelect = (optionId: string) => {
    // Don't allow changing answer if already answered
    if (currentAnswer !== undefined) return;

    // Store the answer in our Zustand store
    setQuestionResponse(currentQuestion.id, optionId);
    
    // Show explanation if available
    if (currentQuestion.explanation) {
      setShowExplanation(true);
    }
  };

  const goNext = () => {
    if (currentIndex < currentQuiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const calculateTimeTaken = (): number => {
    if (!startTime) return 0;
    const endTime = new Date();
    // Return time taken in seconds
    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  };

  // Count correct answers based on the current attempt's responses
  const countCorrectAnswers = () => {
    if (!currentQuiz || !currentAttempt) return 0;
    
    let correctCount = 0;
    
    currentQuiz.questions.forEach(question => {
      const selectedOption = currentAttempt.responses[question.id];
      if (selectedOption && selectedOption === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return correctCount;
  };

  // Check if all questions have been answered
  const hasAnsweredAll = () => {
    if (!currentQuiz || !currentAttempt) return false;
    
    return currentQuiz.questions.every(question => 
      currentAttempt.responses[question.id] !== undefined
    );
  };

  const handleSubmit = async () => {
    if (!currentQuiz || !quizId || !user || !currentAttempt) return;
    
    // Calculate time taken
    const timeTaken = calculateTimeTaken();
    
    try {
      setIsLoading(true);
      
      // Create responses array in the format expected by the server
      const responses: QuestionResponse[] = [];
      
      currentQuiz.questions.forEach((question, index) => {
        const selectedOptionId = currentAttempt.responses[question.id];
        if (selectedOptionId) {
          // Convert option letter (A, B, C...) to index (0, 1, 2...)
          const selectedOption = selectedOptionId.charCodeAt(0) - 65;
          const isCorrect = selectedOptionId === question.correctAnswer;
          
          responses.push({
            question: index, // Use the index in the questions array
            selectedOption,
            isCorrect
          });
        }
      });
      
      // Calculate score as percentage
      const correctAnswers = countCorrectAnswers();
      const score = Math.round((correctAnswers / currentQuiz.totalQuestions) * 100);
      
      // Identify incorrect topics based on tags and difficulty
      const incorrectTopics: string[] = [];
      
      currentQuiz.questions.forEach(question => {
        const selectedOptionId = currentAttempt.responses[question.id];
        if (!selectedOptionId || selectedOptionId !== question.correctAnswer) {
          // Add the difficulty level as a topic for improvement
          if (!incorrectTopics.includes(question.difficulty)) {
            incorrectTopics.push(question.difficulty);
          }
          
          // Add the question tags if available
          if (question.tags && Array.isArray(question.tags)) {
            question.tags.forEach(tag => {
              if (!incorrectTopics.includes(tag)) {
                incorrectTopics.push(tag);
              }
            });
          }
        }
      });
      
      // Use quiz tags and category for additional topic grouping
      if (currentQuiz.tags) {
        currentQuiz.tags.forEach(tag => {
          if (!incorrectTopics.includes(tag)) {
            const tagQuestions = currentQuiz.questions.filter(q => 
              q.tags && q.tags.includes(tag)
            );
            
            // Only add tag if there were incorrect answers for questions with this tag
            const hasIncorrectAnswers = tagQuestions.some(q => 
              !currentAttempt.responses[q.id] || currentAttempt.responses[q.id] !== q.correctAnswer
            );
            
            if (hasIncorrectAnswers) {
              incorrectTopics.push(tag);
            }
          }
        });
      }
      
      if (currentQuiz.category && !incorrectTopics.includes(currentQuiz.category)) {
        incorrectTopics.push(currentQuiz.category);
      }
      
      // Construct the payload for the updated backend endpoint
      const payload = {
        quizId,
        responses,
        score,
        timeTaken,
        incorrectTopics
      };
      
      console.log('Submitting quiz with payload:', payload);
      
      // Use the quiz/attempt endpoint
      const response = await fetch('http://localhost:3600/api/quiz/attempt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit quiz');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Complete the attempt in our store
        finishQuizAttempt();
        
        // Set the quiz result for display
        setQuizResult(data);
      } else {
        throw new Error(data.message || 'Failed to process quiz submission');
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      setError(error.message || 'Failed to submit quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    // Reset component state
    setQuizResult(null);
    setCurrentIndex(0);
    setStartTime(new Date());
    setShowExplanation(false);
    
    // Reset store state and start a new attempt
    startQuizAttempt(quizId || '');
  };

  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'easy') return 'text-green-600';
    if (lowerDifficulty === 'medium') return 'text-yellow-600';
    if (lowerDifficulty === 'hard') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTotalCorrect = (result: QuizSubmissionResult) => {
    if (!result.attempt || !result.attempt.responses) return 0;
    return result.attempt.responses.filter(r => r.isCorrect).length;
  };

  // Menu items for side drawer
  const menuItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'My Quizzes', href: '/quizzes' },
    { label: 'Generate Quiz', href: '/generateQuiz' },
    { label: 'Upload PDF', href: '/upload' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <SideDrawer 
        menuItems={menuItems}
        title="Quiz Menu" 
        exitButtonText="Exit Quiz"
        exitHref="/quizzes"
      />
      
      <div className="p-6 pt-16 md:pl-24 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-xl">
          {isFinished && quizResult ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
              <div className="text-5xl font-bold mb-6">
                <span className={quizResult.attempt.score > 50 ? 'text-green-500' : 'text-red-500'}>
                  {quizResult.attempt.score}%
                </span>
              </div>
              
              <div className="mb-6 text-lg">
                <p>
                  <span className="font-semibold">{getTotalCorrect(quizResult)}</span> correct out of{' '}
                  <span className="font-semibold">{currentQuiz.totalQuestions}</span> questions
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Time taken: {Math.floor(quizResult.attempt.timeTaken / 60)}m {quizResult.attempt.timeTaken % 60}s
                </p>
                <p className="text-gray-500 text-sm">
                  Attempt ID: {quizResult.attempt._id}
                </p>
              </div>
              
              {quizResult.attempt.incorrectTopics && quizResult.attempt.incorrectTopics.length > 0 && (
                <div className="mb-6 text-left">
                  <h3 className="font-semibold mb-2">Areas for improvement:</h3>
                  <ul className="text-gray-600 text-sm">
                    {quizResult.attempt.incorrectTopics.map((topic, index) => (
                      <li key={index} className="list-disc list-inside">
                        {topic.charAt(0).toUpperCase() + topic.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="mb-8 text-gray-600">
                {quizResult.attempt.score === 100 
                  ? 'Perfect score! Excellent work!' 
                  : quizResult.attempt.score > 70 
                    ? 'Great job! You did really well.' 
                    : quizResult.attempt.score > 50 
                      ? 'Good effort! You passed the quiz.' 
                      : 'Keep practicing. You can do better next time!'}
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/generateQuiz')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Back to Quiz Generation
                </button>
                <button
                  onClick={handleTryAgain}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-xl font-bold">{currentQuiz.title}</h1>
                  <span className="text-sm text-gray-500">
                    Question {currentIndex + 1} of {currentQuiz.totalQuestions}
                  </span>
                </div>
                
                <div className="flex items-center mb-4">
                  <span className={`text-sm ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                  </span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">
                    {currentQuestion.language.charAt(0).toUpperCase() + currentQuestion.language.slice(1)}
                  </span>
                  
                  {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                    <>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-blue-500">
                        {currentQuestion.tags[0]}
                      </span>
                    </>
                  )}
                </div>
                
                <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {currentQuestion.options.map((option:any) => {
                  const selected = currentAnswer === option.id;
                  const correct = currentQuestion.correctAnswer === option.id;
                  const alreadyAnswered = currentAnswer !== undefined;

                  return (
                    <button
                      key={option.id}
                      className={`w-full py-3 px-4 rounded-lg border text-left ${
                        selected
                          ? correct
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : alreadyAnswered && correct
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      } ${alreadyAnswered && !selected && !correct ? 'opacity-50' : ''}`}
                      disabled={alreadyAnswered}
                      onClick={() => handleSelect(option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                          selected 
                            ? correct 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white' 
                            : alreadyAnswered && correct
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200'
                        }`}>
                          {option.id}
                        </div>
                        <span>{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Explanation section */}
              {showExplanation && currentQuestion.explanation && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Explanation:</h3>
                  <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={goBack}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2 rounded-lg ${
                    currentIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  Back
                </button>

                {currentIndex === currentQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!hasAnsweredAll()}
                    className={`px-4 py-2 rounded-lg text-white ${
                      !hasAnsweredAll()
                        ? 'bg-blue-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Next
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayAction;