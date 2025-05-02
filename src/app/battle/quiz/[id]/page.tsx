'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizid = searchParams.get('quiz-id');
  const battle = searchParams.get('battleid');
  const { user } = useAuthStore();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<{ quiz: { title: string; questions: { text: string; options: { text: string; isCorrect: boolean; _id: string }[] }[] } } | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [animateQuestion, setAnimateQuestion] = useState(true);

  useEffect(() => {
    if (quizid) {
      const fetchQuizData = async () => {
        try {
          const response = await axios.get(`http://localhost:3600/api/quiz/${quizid}`);
          console.log('Quiz Data:', response.data);
          setQuizData(response.data);
          // Initialize selected answers array with empty strings based on the number of questions
          if (response.data.quiz && response.data.quiz.questions) {
            setSelectedAnswers(Array(response.data.quiz.questions.length).fill(''));
            // Set a timer (5 minutes for the whole quiz)
            setTimeRemaining(300);
          }
        } catch (err) {
          console.error('Error fetching quiz data:', err);
          setError('Failed to fetch quiz data. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchQuizData();
    } else {
      setError('Quiz ID is missing in the URL.');
      setLoading(false);
    }
  }, [quizid]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !quizCompleted) {
      const timerId = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      return () => clearTimeout(timerId);
    } else if (timeRemaining === 0 && !quizCompleted) {
      handleSubmit();
    }
  }, [timeRemaining, quizCompleted]);

  interface Option {
    text: string;
    isCorrect: boolean;
    _id: string;
  }

  const handleOptionSelect = (option: string): void => {
    const newSelectedAnswers: string[] = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = option;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (quizData && currentQuestion < quizData.quiz.questions.length - 1) {
      setAnimateQuestion(false);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setAnimateQuestion(true);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setAnimateQuestion(false);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setAnimateQuestion(true);
      }, 300);
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    
    let correctCount = 0;
    for (let i = 0; i < quizData.quiz.questions.length; i++) {
      const correctOption = quizData.quiz.questions[i].options.find(opt => opt.isCorrect);
      if (correctOption && selectedAnswers[i] === correctOption.text) {
        correctCount++;
      }
    }
    return correctCount;
  };

  const handleSubmit = async () => {
    // Make sure all questions are answered
    if (selectedAnswers.includes('')) {
      setError('Please answer all questions before submitting');
      return;
    }

    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitting(true);

    try {
      const payload = {
        userId: user?.id,
        correctAnswers: finalScore,
        totalQuestions: quizData?.quiz?.questions?.length,
        round: 2,
        battleId: battle,
      };

      console.log('Payload:', payload);

      const response = await fetch('http://localhost:3600/api/score/submitAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      
      if (!response.ok) {
        console.error('Error submitting answers:', response);
        throw new Error('Failed to submit answers');
      }
      
      const data = await response.json();
      console.log('Response:', data);
      setQuizCompleted(true);
    } catch (err) {
      console.error('Error submitting answers:', err);
      setError('Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  if (error && !quizData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error</h2>
          <p className="text-center text-red-500">{error}</p>
          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push('/battle/enrollerdBattle')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || !quizData.quiz) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-xl text-gray-700">No quiz data available</p>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6">
            <h1 className="text-3xl font-bold text-center text-white">Quiz Completed!</h1>
          </div>
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <div className="bg-white w-28 h-28 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">{score}</p>
                    <p className="text-sm text-gray-600">out of {quizData.quiz.questions.length}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-semibold mb-2 text-gray-800">
                {score === quizData.quiz.questions.length 
                  ? 'Perfect Score!' 
                  : score > quizData.quiz.questions.length / 2 
                    ? 'Great job!' 
                    : 'Keep practicing!'}
              </p>
              <p className="text-green-600 font-medium mb-8">
                Your answers have been submitted successfully!
              </p>
              <button 
                onClick={() => router.push('/battle/enrollerdBattle')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md transform hover:scale-105"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuizQuestion = quizData.quiz.questions[currentQuestion];
  const progressPercent = ((currentQuestion + 1) / quizData.quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">{quizData.quiz.title}</h1>
            {timeRemaining !== null && (
              <div className={`text-white font-medium px-4 py-2 rounded-full flex items-center ${timeRemaining < 60 ? 'bg-red-500' : 'bg-blue-800 bg-opacity-50'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-blue-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question counter */}
        <div className="bg-gray-50 py-2 px-6 border-b">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              Question {currentQuestion + 1} of {quizData.quiz.questions.length}
            </span>
            <div className="flex space-x-1">
              {quizData.quiz.questions.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    currentQuestion === index 
                      ? 'bg-blue-600 text-white' 
                      : selectedAnswers[index] 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Question text */}
          <div className={`mb-8 transition-opacity duration-300 ${animateQuestion ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{currentQuizQuestion.text}</h2>
            
            {/* Options */}
            <div className="space-y-4">
              {currentQuizQuestion.options.map((option, index) => (
                <div 
                  key={option._id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === option.text 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => handleOptionSelect(option.text)}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                      selectedAnswers[currentQuestion] === option.text 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}>
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-500 rounded">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg flex items-center transition-all ${
                currentQuestion === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-800 shadow-md'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {currentQuestion < quizData.quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center shadow-md transition-all"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg flex items-center shadow-md transition-all ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}