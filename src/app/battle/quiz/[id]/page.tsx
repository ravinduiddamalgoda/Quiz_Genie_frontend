'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

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
  // const token = useAuthStore((state) => state.token);
  const [quizData, setQuizData] = useState<{ quiz: { title: string; questions: { text: string; options: { text: string; isCorrect: boolean; _id: string }[] }[] } } | null>(null);

  useEffect(() => {
    if (quizid) {
      const fetchQuizData = async () => {
        try {
          const response = await axios.get(`http://localhost:3600/api/quiz/${quizid}`);
          console.log('Quiz Data:', response.data);
          setQuizData(response.data); // Store the fetched quiz data
          // Initialize selected answers array with empty strings based on the number of questions
          if (response.data.quiz && response.data.quiz.questions) {
            setSelectedAnswers(Array(response.data.quiz.questions.length).fill(''));
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
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading quiz data...</div>;
  }

  if (error && !quizData) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!quizData || !quizData.quiz) {
    return <div className="flex justify-center items-center h-screen">No quiz data available</div>;
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
        <h1 className="text-2xl font-bold text-center mb-6">Quiz Completed!</h1>
        <div className="text-center">
          <p className="text-xl mb-4">Your score: {score} out of {quizData.quiz.questions.length}</p>
          <p className="text-green-600 font-semibold mb-6">
            Your answers have been submitted successfully!
          </p>
          <button 
            onClick={() => router.push('/battle/enrollerdBattle')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuizQuestion = quizData.quiz.questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{quizData.quiz.title}</h1>
        <span className="text-gray-600">
          Question {currentQuestion + 1} of {quizData.quiz.questions.length}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{currentQuizQuestion.text}</h2>
        <div className="space-y-3">
          {currentQuizQuestion.options.map((option, index) => (
            <div 
              key={option._id}
              className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                selectedAnswers[currentQuestion] === option.text ? 'bg-blue-100 border-blue-400' : ''
              }`}
              onClick={() => handleOptionSelect(option.text)}
            >
              {option.text}
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestion === 0 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          Previous
        </button>

        {currentQuestion < quizData.quiz.questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-green-600 text-white px-4 py-2 rounded-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      <div className="mt-8">
        <div className="flex justify-center">
          {quizData.quiz.questions.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 mx-1 rounded-full flex items-center justify-center cursor-pointer ${
                currentQuestion === index 
                  ? 'bg-blue-600 text-white' 
                  : selectedAnswers[index] 
                    ? 'bg-green-100 border border-green-400' 
                    : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}