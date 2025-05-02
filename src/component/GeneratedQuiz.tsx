'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Share2, Edit, Copy, Check } from 'lucide-react';
import { useAuthStore } from '@/store/useStore';

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
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  totalQuestions: number;
}

interface GeneratedQuizProps {
  quizId: string;
}

const GeneratedQuiz: React.FC<GeneratedQuizProps> = ({ quizId }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3600/api/quizzes/${quizId}`, {
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

        if (data.status === 'success') {
          setQuiz(data.data.quiz);
        } else {
          throw new Error(data.message || 'Failed to load quiz');
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (token && quizId) {
      fetchQuiz();
    }
  }, [quizId, token]);

  const handlePlay = () => {
    router.push(`/generateQuiz/playQuiz?id=${quizId}`);
  };

  const handleEdit = () => {
    router.push(`/generateQuiz/edit?id=${quizId}`);
  };

  const handleDownload = async () => {
    if (!quiz) return;

    try {
      // Create a formatted text version of the quiz
      let content = `${quiz.title}\n\n`;
      
      quiz.questions.forEach((q, index) => {
        content += `Question ${index + 1}: ${q.text}\n`;
        q.options.forEach(opt => {
          content += `${opt.id}. ${opt.text}\n`;
        });
        content += `Correct Answer: ${q.correctAnswer}\n\n`;
      });
      
      // Create a download link
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quiz.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading quiz:', error);
      alert('Failed to download quiz');
    }
  };

  const handleCopyLink = () => {
    try {
      const url = `${window.location.origin}/generateQuiz/playQuiz?id=${quizId}`;
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty === 'easy') return 'bg-green-100 text-green-800';
    if (lowerDifficulty === 'medium') return 'bg-yellow-100 text-yellow-800';
    if (lowerDifficulty === 'hard') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="text-center p-6 border border-red-200 rounded-lg">
        <p className="text-lg text-red-500 mb-4">{error || 'Quiz not found'}</p>
        <button 
          onClick={() => router.push('/generateQuiz')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Quiz Generator
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
        <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-3">
          <span>{quiz.totalQuestions} questions</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Multiple languages</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>Mixed difficulty</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={handlePlay}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <span className="mr-2">▶</span> Play Quiz
          </button>
          
          <button 
            onClick={handleEdit}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Edit size={16} className="mr-2" /> Edit
          </button>
          
          <button 
            onClick={handleDownload}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
          >
            <Download size={16} className="mr-2" /> Download
          </button>
          
          <button 
            onClick={handleCopyLink}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
          >
            {copySuccess ? (
              <>
                <Check size={16} className="mr-2 text-green-500" /> Copied!
              </>
            ) : (
              <>
                <Share2 size={16} className="mr-2" /> Share
              </>
            )}
          </button>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Questions Preview</h3>
        
        <div className="space-y-4">
          {quiz.questions.slice(0, 3).map((question) => (
            <div key={question.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-md font-medium">{question.text}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mt-2">
                {question.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-2 border rounded text-sm ${
                      option.id === question.correctAnswer
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-medium mr-1">{option.id}:</span> {option.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {quiz.questions.length > 3 && (
            <div className="text-center py-3 border-t">
              <p className="text-sm text-gray-500">
                +{quiz.questions.length - 3} more questions
              </p>
              <button
                onClick={handlePlay}
                className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
              >
                Play to see all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneratedQuiz;