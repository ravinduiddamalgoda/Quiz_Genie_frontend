'use client';

import React, { useState } from 'react';

interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswer: number;
  difficulty: string;
  language: string;
}

interface QuizPlayActionProps {
  questions: Question[];
}

const QuizPlayAction: React.FC<QuizPlayActionProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const currentQuestion = questions[currentIndex];
  const isFinished = score !== null;

  const handleSelect = (index: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return;

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentIndex] = index;
    setSelectedAnswers(updatedAnswers);
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) total++;
    });
    setScore(total);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-xl">
        {isFinished ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your Marks</h2>
            <p className="text-lg">{score} / {questions.length}</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Question {currentIndex + 1} of {questions.length} ({currentQuestion.difficulty})
              </p>
              <h2 className="text-xl font-semibold my-3">{currentQuestion.text}</h2>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.answers.map((answer, index) => {
                const selected = selectedAnswers[currentIndex] === index;
                const correct = currentQuestion.correctAnswer === index;
                const alreadyAnswered = selectedAnswers[currentIndex] !== undefined;

                return (
                  <button
                    key={index}
                    className={`w-full py-2 px-4 rounded-lg border text-left ${
                      selected
                        ? correct
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    } ${alreadyAnswered && !selected ? 'opacity-50' : ''}`}
                    disabled={alreadyAnswered}
                    onClick={() => handleSelect(index)}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={goBack}
                disabled={currentIndex === 0}
                className={`px-4 py-2 rounded-lg text-white ${
                  currentIndex === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                Back
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
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
  );
};

export default QuizPlayAction;
