'use client';
import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';

// Quiz questions data
const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    correctAnswer: "Paris"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: "Pacific Ocean"
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Osmium", "Oxygen", "Gold", "Oregonium"],
    correctAnswer: "Oxygen"
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: "William Shakespeare"
  },
  {
    question: "What is the tallest mountain in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
    correctAnswer: "Mount Everest"
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Thailand", "Japan", "South Korea"],
    correctAnswer: "Japan"
  },
  {
    question: "Who discovered penicillin?",
    options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Joseph Lister"],
    correctAnswer: "Alexander Fleming"
  },
  {
    question: "What is the largest mammal on Earth?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale"
  }
];

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const battleId = searchParams.get('battleId');
  // const { battleId } = router.query;
  const { user } = useAuthStore();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quizQuestions.length).fill(''));
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState('');


interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

const handleOptionSelect = (option: string): void => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = option;
    setSelectedAnswers(newSelectedAnswers);
};

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    for (let i = 0; i < quizQuestions.length; i++) {
      if (selectedAnswers[i] === quizQuestions[i].correctAnswer) {
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
        userId: user?.id || '',
        correctAnswers: finalScore,
        totalQuestions: quizQuestions.length,
        round: 2,
        battleId: battleId
      };

      const response = await fetch('http://localhost:3600/api/score/submitAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
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

  if (!battleId) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (quizCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
        <h1 className="text-2xl font-bold text-center mb-6">Quiz Completed!</h1>
        <div className="text-center">
          <p className="text-xl mb-4">Your score: {score} out of {quizQuestions.length}</p>
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md my-10">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quiz Challenge</h1>
        <span className="text-gray-600">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{quizQuestions[currentQuestion].question}</h2>
        <div className="space-y-3">
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <div 
              key={index}
              className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                selectedAnswers[currentQuestion] === option ? 'bg-blue-100 border-blue-400' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
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

        {currentQuestion < quizQuestions.length - 1 ? (
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
          {quizQuestions.map((_, index) => (
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