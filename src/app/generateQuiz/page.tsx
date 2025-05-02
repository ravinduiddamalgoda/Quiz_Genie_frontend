'use client';

import React, { useState, useEffect } from 'react';
import { File, X, Plus, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useQuizStore } from '@/store/useStore';

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
  isIndexed?: boolean; // Added isIndexed property
}

const GenerateQuizPage: React.FC = () => {
    const router = useRouter();
    const [prompt, setPrompt] = useState<string>('');
    const [selectedPdfs, setSelectedPdfs] = useState<ServerPdf[]>([]);
    const [availablePdfs, setAvailablePdfs] = useState<ServerPdf[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPdfSelector, setShowPdfSelector] = useState<boolean>(false);
    const token = useAuthStore((state) => state.token);

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
        if (selectedPdfs.some(selected => selected.id === pdf.id)) {
            // Remove if already selected
            setSelectedPdfs(selectedPdfs.filter(selected => selected.id !== pdf.id));
        } else {
            // Add if not already selected
            setSelectedPdfs([...selectedPdfs, pdf]);
        }
    };

    const handleRemovePdf = (pdfId: string) => {
        setSelectedPdfs(selectedPdfs.filter(pdf => pdf.id !== pdfId));
    };

    const isPdfSelected = (pdfId: string) => {
        return selectedPdfs.some(pdf => pdf.id === pdfId);
    };

    const handleSendPrompt = async () => {
        if (selectedPdfs.length === 0 || prompt.trim() === '') return;
        
        setIsLoading(true);
        
        try {
          // Format data according to the expected API format
          const pdfIds = selectedPdfs.map(pdf => pdf._id);
          
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
            throw new Error('Failed to generate quiz');
          }
          
          const data = await response.json();   
          
          if (data.status === 'success') {
            // Store the quiz in Zustand
            useQuizStore.getState().setCurrentQuiz(data.data.quiz);
            console.log('Quiz generated successfully:', data.data.quiz);
            // Navigate to the quiz player with the generated quiz ID
            router.push(`/generateQuiz/playQuiz`);
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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
            <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[#1E3F66]">Generate Quiz</h1>
                </div>
                <p className="text-gray-600 mt-1">Create quizzes from your PDF documents with AI assistance</p>

                <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2 text-[#1E3F66]">
                        Enter your prompt:
                    </label>
                    <textarea 
                        className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-[#1E3F66] focus:border-[#1E3F66] text-black"
                        placeholder="Describe the type of quiz you want to generate..."
                        value={prompt}
                        onChange={handlePromptChange}
                    />
                </div>

                <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2 text-[#1E3F66]">
                        Select PDF Sources:
                    </label>
                    
                    {/* Selected PDFs display */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedPdfs.map((pdf) => (
                            <div key={pdf.id} className="flex items-center bg-gray-100 rounded-md p-2 border border-gray-200">
                                <File size={18} className="mr-2 text-[#1E3F66]" />
                                <span className="text-sm truncate max-w-xs text-black">
                                    {pdf.filename || pdf.title}
                                </span>
                                <button 
                                    className="ml-2 text-red-600 hover:text-red-800 text-sm"
                                    onClick={() => handleRemovePdf(pdf.id)}
                                    aria-label="Remove PDF"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    {/* Add PDF button */}
                    <button 
                        className="inline-flex items-center gap-2 p-2 border border-[#1E3F66] rounded-md text-[#1E3F66] hover:bg-gray-100 transition-colors"
                        onClick={handleTogglePdfSelector}
                    >
                        <Plus size={16} className="font-bold" /> Add PDF Source
                    </button>
                    
                    {/* PDF Selector Modal/Dropdown */}
                    {showPdfSelector && (
                        <div className="mt-3 border border-gray-200 rounded-md shadow-md p-3 bg-white">
                            <h3 className="text-sm font-medium mb-2 text-[#1E3F66]">Your PDFs</h3>
                            
                            <div className="max-h-60 overflow-y-auto">
                                {availablePdfs.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        {isLoading ? 'Loading PDFs...' : 'No PDFs available'}
                                    </p>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {availablePdfs.map(pdf => (
                                            <li 
                                                key={pdf.id} 
                                                className={`py-2 px-1 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${isPdfSelected(pdf.id) ? 'bg-gray-50' : ''}`}
                                            >
                                                <div className="flex items-center flex-1" onClick={() => handleSelectPdf(pdf)}>
                                                    <File size={16} className="mr-2 text-[#1E3F66]" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-black font-medium">
                                                            {pdf.filename || pdf.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {pdf.subject} • {pdf.formattedSize} • 
                                                            {new Date(pdf.createdAt).toLocaleDateString()}
                                                        </span>
                                                        {/* Add index status badge */}
                                                        {pdf.isIndexed !== undefined && (
                                                            <span className={`text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block w-max ${pdf.isIndexed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {pdf.isIndexed ? 'Indexed' : 'Not Indexed'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        className="mr-2 p-1 text-[#1E3F66] hover:text-[#162D4E]"
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
                                                            <div className="w-4 h-4 bg-[#1E3F66] rounded flex items-center justify-center">
                                                                <Check size={12} className="text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-4 h-4 border border-[#1E3F66] rounded"></div>
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
                                    className="px-3 py-1 text-sm bg-[#1E3F66] text-white rounded hover:bg-[#162D4E] transition-colors"
                                    onClick={handleTogglePdfSelector}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {selectedPdfs.length === 0 && (
                        <p className="text-sm text-red-500 mt-2">
                            Please select at least one PDF source before generating the quiz.
                        </p>
                    )}
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button 
                        className="flex items-center gap-2 px-6 py-3 bg-[#1E3F66] text-white rounded-md hover:bg-[#162D4E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3F66] focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                        disabled={selectedPdfs.length === 0 || isLoading || prompt.trim() === ''}
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
            </div>
        </div>
    );
};

export default GenerateQuizPage;