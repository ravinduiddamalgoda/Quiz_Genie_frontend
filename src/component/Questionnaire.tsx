'use client';

import React, { useState } from 'react';

interface QuestionType {
  id: string;
  type: 'text' | 'choice' | 'multiple' | 'rating';
  text: string;
  options?: string[];
  required?: boolean;
}

interface QuestionnaireProps {
  questions: QuestionType[];
  onSubmit: (responses: Record<string, string[]>) => void;
  title?: string;
  submitButtonText?: string;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({
  questions,
  onSubmit,
  title = 'Questionnaire',
  submitButtonText = 'Submit'
}) => {
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize responses
  React.useEffect(() => {
    const initialResponses: Record<string, string[]> = {};
    questions.forEach(q => {
      initialResponses[q.id] = [];
    });
    setResponses(initialResponses);
  }, [questions]);

  const handleTextChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: [value]
    }));
    
    // Clear error if field is filled
    if (value.trim() !== '') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleChoiceChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: [value]
    }));
    
    // Clear error when a choice is selected
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const handleMultipleChange = (questionId: string, value: string, checked: boolean) => {
    setResponses(prev => {
      const current = [...(prev[questionId] || [])];
      
      if (checked) {
        // Add the value if it's not already in the array
        if (!current.includes(value)) {
          current.push(value);
        }
      } else {
        // Remove the value if it exists in the array
        const index = current.indexOf(value);
        if (index !== -1) {
          current.splice(index, 1);
        }
      }
      
      return {
        ...prev,
        [questionId]: current
      };
    });
    
    // Clear error if at least one option is selected
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const handleRatingChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: [value]
    }));
    
    // Clear error when a rating is selected
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[questionId];
      return newErrors;
    });
  };

  const validateResponses = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    questions.forEach(question => {
      if (question.required) {
        const response = responses[question.id];
        
        if (!response || (Array.isArray(response) && response.length === 0) || 
            (response.length === 1 && response[0].trim() === '')) {
          newErrors[question.id] = 'This question requires an answer';
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateResponses()) {
      onSubmit(responses);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">{title}</h2>
      
      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => (
          <div key={question.id} className="mb-6 pb-4 border-b border-gray-200">
            <div className="mb-2 flex items-start">
              <span className="text-lg font-medium">
                {index + 1}. {question.text}
              </span>
              {question.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </div>
            
            {/* Text input */}
            {question.type === 'text' && (
              <div>
                <textarea
                  className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
                    ${errors[question.id] ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  value={responses[question.id]?.[0] || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  placeholder="Your answer"
                />
                {errors[question.id] && (
                  <p className="mt-1 text-sm text-red-500">{errors[question.id]}</p>
                )}
              </div>
            )}
            
            {/* Single choice (radio buttons) */}
            {question.type === 'choice' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-5 w-5 text-blue-600"
                      name={`question-${question.id}`}
                      value={option}
                      checked={responses[question.id]?.[0] === option}
                      onChange={() => handleChoiceChange(question.id, option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                {errors[question.id] && (
                  <p className="mt-1 text-sm text-red-500">{errors[question.id]}</p>
                )}
              </div>
            )}
            
            {/* Multiple choice (checkboxes) */}
            {question.type === 'multiple' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optIndex) => (
                  <label key={optIndex} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-600"
                      value={option}
                      checked={responses[question.id]?.includes(option) || false}
                      onChange={(e) => handleMultipleChange(question.id, option, e.target.checked)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
                {errors[question.id] && (
                  <p className="mt-1 text-sm text-red-500">{errors[question.id]}</p>
                )}
              </div>
            )}
            
            {/* Rating (1-5 stars) */}
            {question.type === 'rating' && (
              <div>
                <div className="flex space-x-4 items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(question.id, rating.toString())}
                      className={`h-10 w-10 rounded-full flex items-center justify-center focus:outline-none 
                        ${parseInt(responses[question.id]?.[0] || '0') >= rating 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1 px-2">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
                {errors[question.id] && (
                  <p className="mt-1 text-sm text-red-500">{errors[question.id]}</p>
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;