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
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  
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

  // Start timer function
  const startTimer = () => {
    const interval = setInterval(() => {
      setQuizTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  // Format time function
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Set start time when component mounts
    setStartTime(new Date());
    startTimer();
    
    // Clear the timer when component unmounts
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading your quiz...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-xl text-center border border-red-100">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Encountered</h2>
          <p className="text-red-500 font-medium mb-6">{error || 'Quiz not found'}</p>
          <button 
            onClick={() => router.push('/generateQuiz')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Quiz Generation
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

  // Get number of questions answered
  const getAnsweredCount = () => {
    if (!currentQuiz || !currentAttempt) return 0;
    
    return currentQuiz.questions.filter(question => 
      currentAttempt.responses[question.id] !== undefined
    ).length;
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
        
        // Stop the timer
        if (timerInterval) clearInterval(timerInterval);
        
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
    setQuizTimer(0);
    startTimer();
    
    // Reset store state and start a new attempt
    startQuizAttempt(quizId || '');
  };

  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'easy') return {
      text: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'border-emerald-200'
    };
    if (lowerDifficulty === 'medium') return {
      text: 'text-amber-600',
      bg: 'bg-amber-100',
      border: 'border-amber-200'
    };
    if (lowerDifficulty === 'hard') return {
      text: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-red-200'
    };
    return {
      text: 'text-gray-600',
      bg: 'bg-gray-100',
      border: 'border-gray-200'
    };
  };

  const getTotalCorrect = (result: QuizSubmissionResult) => {
    if (!result.attempt || !result.attempt.responses) return 0;
    return result.attempt.responses.filter(r => r.isCorrect).length;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score === 100) return 'Perfect score! Outstanding job!';
    if (score >= 90) return 'Excellent work! Nearly perfect!';
    if (score >= 80) return 'Great job! You really know your stuff!';
    if (score >= 70) return 'Good effort! You passed with a solid score.';
    if (score >= 60) return 'Nice work! You passed the quiz.';
    if (score >= 50) return 'You passed, but there\'s room for improvement.';
    if (score >= 40) return 'Keep studying. You\'re getting there!';
    if (score >= 30) return 'More practice needed. Don\'t give up!';
    return 'This topic needs more attention. Try again after reviewing.';
  };

  // Menu items for side drawer
  const menuItems = [
    { label: 'Dashboard', href: '/' },
    { label: 'My Quizzes', href: '/quizzes' },
    { label: 'Generate Quiz', href: '/generateQuiz' },
    { label: 'Upload PDF', href: '/upload' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SideDrawer 
        menuItems={menuItems}
        title="Quiz Menu" 
        exitButtonText="Exit Quiz"
        exitHref="/quizzes"
      />
      
      <div className="p-6 pt-16 md:pl-24 min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-3xl overflow-hidden border border-gray-100">
          {/* Quiz header - always visible */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold">{currentQuiz.title}</h1>
            <div className="flex items-center text-blue-100 mt-1">
              {currentQuiz.category && (
                <span className="text-sm mr-3">Category: {currentQuiz.category}</span>
              )}
              {currentQuiz.language && (
                <span className="text-sm mr-3">Language: {currentQuiz.language}</span>
              )}
              <div className="ml-auto flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{formatTime(quizTimer)}</span>
              </div>
            </div>
          </div>
          
          {isFinished && quizResult ? (
            /* Results screen */
            <div className="p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      className="text-gray-200 fill-current"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`${getScoreColor(quizResult.attempt.score)} fill-current`}
                      strokeDasharray={`${quizResult.attempt.score}, 120`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      strokeWidth="1"
                      strokeDashoffset="35"
                    />
                    <text x="18" y="22.35" className="text-sm font-bold" textAnchor="middle" fill="currentColor">
                      {quizResult.attempt.score}%
                    </text>
                  </svg>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Results</h2>
                <p className="text-lg mb-6">
                  <span className="font-semibold">{getTotalCorrect(quizResult)}</span> correct out of{' '}
                  <span className="font-semibold">{currentQuiz.totalQuestions}</span> questions
                </p>
                
                <div className="flex justify-center space-x-6 mb-6 text-center">
                  <div className="bg-blue-50 rounded-lg p-3 w-32">
                    <div className="text-blue-500 text-xl font-semibold">
                      {Math.floor(quizResult.attempt.timeTaken / 60)}:{(quizResult.attempt.timeTaken % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">
                      Time Taken
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3 w-32">
                    <div className="text-purple-500 text-xl font-semibold">
                      {getTotalCorrect(quizResult)}
                    </div>
                    <div className="text-xs text-purple-700 mt-1">
                      Correct Answers
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-3 w-32">
                    <div className="text-emerald-500 text-xl font-semibold">
                      {quizResult.attempt.score}%
                    </div>
                    <div className="text-xs text-emerald-700 mt-1">
                      Final Score
                    </div>
                  </div>
                </div>
                
                <p className="text-lg mb-3 font-medium">{getScoreMessage(quizResult.attempt.score)}</p>
                
                {quizResult.attempt.incorrectTopics && quizResult.attempt.incorrectTopics.length > 0 && (
                  <div className="mb-8 text-left p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <h3 className="font-semibold text-amber-700 mb-2">Areas for improvement:</h3>
                    <div className="flex flex-wrap gap-2">
                      {quizResult.attempt.incorrectTopics.map((topic, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-white rounded border border-amber-200 text-amber-700 text-sm">
                          {topic.charAt(0).toUpperCase() + topic.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mb-8">
                  Attempt ID: {quizResult.attempt._id}
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => router.push('/generateQuiz')}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Quiz Generation
                  </button>
                  <button
                    onClick={handleTryAgain}
                    className="px-5 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Quiz in progress */
            <div>
              <div className="p-6">
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${(getAnsweredCount() / currentQuiz.totalQuestions) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium mr-2">
                      {currentIndex + 1}/{currentQuiz.totalQuestions}
                    </span>
                    
                    {currentQuestion.difficulty && (
                      <span className={`inline-block px-3 py-1 ${getDifficultyColor(currentQuestion.difficulty).bg} ${getDifficultyColor(currentQuestion.difficulty).text} rounded-full text-sm`}>
                        {currentQuestion.difficulty.charAt(0).toUpperCase() + currentQuestion.difficulty.slice(1)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {currentQuestion.tags && currentQuestion.tags.length > 0 && (
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                        {currentQuestion.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                    {currentQuestion.text}
                  </h2>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options.map((option) => {
                      const selected = currentAnswer === option.id;
                      const correct = currentQuestion.correctAnswer === option.id;
                      const alreadyAnswered = currentAnswer !== undefined;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(option.id)}
                          disabled={alreadyAnswered}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                            selected
                              ? correct
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-red-50 border-red-500 text-red-800'
                              : alreadyAnswered && correct
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                          } ${alreadyAnswered && !selected && !correct ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 ${
                              selected 
                                ? correct 
                                  ? 'bg-emerald-500 text-white' 
                                  : 'bg-red-500 text-white' 
                                : alreadyAnswered && correct
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-blue-100 text-blue-700'
                            }`}>
                              {option.id}
                            </div>
                            <span className="text-left">{option.text}</span>
                            
                            {/* Show correct/incorrect icons for answered questions */}
                            {alreadyAnswered && selected && (
                              <div className="ml-auto">
                                {correct ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                )}
                              </div>
                            )}
                            
                            {/* Show correct mark for correct answer that wasn't selected */}
                            {alreadyAnswered && !selected && correct && (
                              <div className="ml-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Explanation section with improved styling */}
                {showExplanation && currentQuestion.explanation && (
                  <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Explanation:
                    </h3>
                    <p className="text-blue-700 leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                  <button
                    onClick={goBack}
                    disabled={currentIndex === 0}
                    className={`px-5 py-3 rounded-lg flex items-center transition-colors ${
                      currentIndex === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>

                  {currentIndex === currentQuiz.questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!hasAnsweredAll()}
                      className={`px-5 py-3 rounded-lg flex items-center ${
                        !hasAnsweredAll()
                          ? 'bg-blue-300 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Submit Quiz
                    </button>
                  ) : (
                    <button
                      onClick={goNext}
                      className="px-5 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md flex items-center"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Question navigation panel */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentQuiz.questions.map((question, index) => {
                    const answered = currentAttempt && currentAttempt.responses[question.id] !== undefined;
                    const correct = currentAttempt && currentAttempt.responses[question.id] === question.correctAnswer;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm font-medium transition-all ${
                          currentIndex === index 
                            ? 'ring-2 ring-blue-400 border-blue-500 bg-blue-100 text-blue-700' 
                            : answered 
                              ? correct 
                                ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                                : 'bg-red-100 border-red-500 text-red-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayAction;