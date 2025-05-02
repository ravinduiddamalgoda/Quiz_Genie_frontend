'use client';

import React, { useState, useEffect } from 'react';
import { File, X, Plus, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useQuizStore } from '@/store/useStore';
import { useParams } from 'next/navigation';

interface ServerPdf {
  _id: string;
  title: string;
  subject: string;
  description: string;
  filename?: string;
  key: string;
  formattedSize: string;
  createdAt: string;
  id: string;
}

const GenerateQuizPage: React.FC = () => {
    const router = useRouter();
    const [prompt, setPrompt] = useState<string>('');
    const [selectedPdfs, setSelectedPdfs] = useState<ServerPdf | null>();
    const [availablePdfs, setAvailablePdfs] = useState<ServerPdf[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPdfSelector, setShowPdfSelector] = useState<boolean>(false);
    const token = useAuthStore((state) => state.token);
    const params = useParams();
    const battleId = params.id as string;
    // Fetch PDFs from API
    useEffect(() => {
        const fetchPdfs = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:3600/api/files/get-files', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch PDFs');
                }
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    setAvailablePdfs(data.data);
                } else {
                    console.error('API returned error:', data);
                }
            } catch (error) {
                console.error('Error fetching PDFs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchPdfs();
        }
    }, [token]);

    const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    };

    const handleTogglePdfSelector = () => {
        setShowPdfSelector(!showPdfSelector);
    };

    const handleSelectPdf = (pdf: ServerPdf) => {
         setSelectedPdfs(pdf);
    };

    const handleRemovePdf = (pdfId: string) => {
        setSelectedPdfs(null);
    };

    const isPdfSelected = (pdfId: string) => {
        return selectedPdfs && selectedPdfs._id === pdfId;
    };

    const handleSendPrompt = async () => {
        if (selectedPdfs === null || prompt.trim() === '' || selectedPdfs === undefined) return;
        
        setIsLoading(true);
        
        try {
          // Format data according to the expected API format
          const pdfIds = selectedPdfs._id;
          
          const payload = {
            prompt: prompt,
            pdfIds: pdfIds
          };
          
          const response = await fetch('http://localhost:3600/api/quiz-generator/generate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            console.error('Response not OK:', response.statusText);
            throw new Error('Failed to generate quiz');
          }
          
          const data = await response.json();   
          
          if (data.status === 'success') {
            // Store the quiz in Zustand
            // useQuizStore.getState().setCurrentQuiz(data.data.quiz);
            console.log('Quiz generated successfully:', data.data.quiz);
            const quizId = data.data.quiz._id;
            const playLoadupdateBattle = {
                quizId: quizId
            };
            // Navigate to the quiz player with the generated quiz ID
            const addQuizToBattle = await fetch(`http://localhost:3600/api/battle/update-quiz/${battleId}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(playLoadupdateBattle)
              });

              if (!addQuizToBattle.ok) {
                throw new Error('Failed to generate quiz');
              }
              console.log('Quiz added to battle successfully:', addQuizToBattle);

          } else {
            console.error('API returned error:', data);
            alert('Failed to generate quiz: ' + (data.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error generating quiz:', error);
          alert('Failed to generate quiz. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };

    const downloadPdf = async (pdfId: string) => {
        try {
            const response = await fetch(`http://localhost:3600/api/files/download/${pdfId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to get download URL');
            }
            
            const data = await response.json();
            
            if (data.status === 'success' && data.data.downloadUrl) {
                // Open the download URL in a new tab
                window.open(data.data.downloadUrl, '_blank');
            } else {
                console.error('API returned error:', data);
                alert('Failed to download PDF');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Please try again later.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">Generate Quiz</h1>
            <p className="mb-6">Welcome to the quiz generation page. Use the tools below to create your quiz.</p>
            
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                <label className="block text-sm font-medium mb-2">
                    Enter your prompt:
                </label>
                <textarea 
                    className="w-full p-3 border border-blue-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the type of quiz you want to generate..."
                    value={prompt}
                    onChange={handlePromptChange}
                />
            </div>
            
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                <label className="block text-sm font-medium mb-2 text-blue-700">
                    Select PDF Sources:
                </label>
                
                {/* Selected PDFs display */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedPdfs && selectedPdfs._id && (
                        <div key={selectedPdfs?._id} className="flex items-center bg-blue-100 rounded-md p-2 border border-blue-200">
                            <File size={18} className="mr-2 text-blue-600" />
                            <span className="text-sm truncate max-w-xs text-blue-800">
                                {selectedPdfs?.filename || selectedPdfs?.title}
                            </span>
                            <button 
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                onClick={() => handleRemovePdf(selectedPdfs?.id)}
                                aria-label="Remove PDF"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Add PDF button */}
                <button 
                    className="inline-flex items-center gap-2 p-2 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-100 transition-colors"
                    onClick={handleTogglePdfSelector}
                >
                    <Plus size={16} className="font-bold" /> Add PDF Source
                </button>
                
                {/* PDF Selector Modal/Dropdown */}
                {showPdfSelector && (
                    <div className="mt-3 border border-blue-200 rounded-md shadow-md p-3 bg-white">
                        <h3 className="text-sm font-medium mb-2 text-blue-700">Your PDFs</h3>
                        
                        <div className="max-h-60 overflow-y-auto">
                            {availablePdfs.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    {isLoading ? 'Loading PDFs...' : 'No PDFs available'}
                                </p>
                            ) : (
                                <ul className="divide-y divide-blue-100">
                                    {availablePdfs.map(pdf => (
                                        <li 
                                            key={pdf.id} 
                                            className={`py-2 px-1 flex items-center justify-between cursor-pointer hover:bg-blue-50 ${isPdfSelected(pdf.id) ? 'bg-blue-50' : ''}`}
                                        >
                                            <div className="flex items-center flex-1" onClick={() => handleSelectPdf(pdf)}>
                                                <File size={16} className="mr-2 text-blue-600" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-blue-800 font-medium">
                                                        {pdf.filename || pdf.title}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {pdf.subject} • {pdf.formattedSize} • 
                                                        {new Date(pdf.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    className="mr-2 p-1 text-blue-600 hover:text-blue-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        downloadPdf(pdf._id);
                                                    }}
                                                    title="Download PDF"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                    </svg>
                                                </button>
                                                <div onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectPdf(pdf);
                                                }}>
                                                    {isPdfSelected(pdf.id) ? (
                                                        <Check size={16} className="text-blue-600" />
                                                    ) : (
                                                        <div className="w-4 h-4 border border-blue-400 rounded"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        <div className="flex justify-end mt-3">
                            <button 
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                onClick={handleTogglePdfSelector}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
                
                {selectedPdfs === null && (
                    <p className="text-sm text-red-500 mt-2">
                        Please select at least one PDF source before generating the quiz.
                    </p>
                )}
            </div>
            
            <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
                disabled={selectedPdfs === null || isLoading || prompt.trim() === ''}
                onClick={handleSendPrompt}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </span>
                ) : 'Generate Quiz'}
            </button>
        </div>
    );
};

export default GenerateQuizPage;