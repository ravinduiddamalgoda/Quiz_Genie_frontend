'use client';

import GenerateQuiz from '@/component/GeneratedQuiz';
import React, { useState, useEffect } from 'react';
import { File, X, Plus, Check } from 'lucide-react';
import { useRouter } from 'next/navigation'
interface ServerPdf {
  id: string;
  name: string;
  uploadedAt: string;
}

const GenerateQuizPage: React.FC = () => {
    const router = useRouter()
    const [prompt, setPrompt] = useState<string>('');
    const [selectedPdfs, setSelectedPdfs] = useState<ServerPdf[]>([]);
    const [availablePdfs, setAvailablePdfs] = useState<ServerPdf[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPdfSelector, setShowPdfSelector] = useState<boolean>(false);

    // Mock server PDFs - replace with actual API call
    useEffect(() => {
        // Simulate API fetch
        const fetchPdfs = async () => {
            // Replace with actual API call
            const mockPdfs: ServerPdf[] = [
                { id: '1', name: 'Chemistry_Textbook.pdf', uploadedAt: '2025-03-15' },
                { id: '2', name: 'Physics_Notes.pdf', uploadedAt: '2025-03-17' },
                { id: '3', name: 'Mathematics_Formulas.pdf', uploadedAt: '2025-03-18' },
                { id: '4', name: 'Biology_Diagrams.pdf', uploadedAt: '2025-03-20' },
                { id: '5', name: 'History_Timeline.pdf', uploadedAt: '2025-03-21' },
            ];
            setAvailablePdfs(mockPdfs);
        };

        fetchPdfs();
    }, []);

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

    const handleSendPrompt = () => {
        if (selectedPdfs.length === 0) return;
        
        setIsLoading(true);
        // Implementation for sending prompt and files
        console.log('Sending prompt:', prompt);
        console.log('Selected PDFs:', selectedPdfs);
        
        // Mock api call
        setTimeout(() => {
            setIsLoading(false);
            setShowPdfSelector(false);
        }, 200);

        router.push('generateQuiz/playQuiz');
    };

    return (
        <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">Generate Quiz</h1>
            <p className="mb-6 ">Welcome to the quiz generation page. Use the tools below to create your quiz.</p>
            
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-blue-200">
                <label className="block text-sm font-medium mb-2 ">
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
                    {selectedPdfs.map((pdf) => (
                        <div key={pdf.id} className="flex items-center bg-blue-100 rounded-md p-2 border border-blue-200">
                            <File size={18} className="mr-2 text-blue-600" />
                            <span className="text-sm truncate max-w-xs text-blue-800">{pdf.name}</span>
                            <button 
                                className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
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
                                <p className="text-sm text-gray-500">No PDFs available</p>
                            ) : (
                                <ul className="divide-y divide-blue-100">
                                    {availablePdfs.map(pdf => (
                                        <li 
                                            key={pdf.id} 
                                            className={`py-2 px-1 flex items-center justify-between cursor-pointer hover:bg-blue-50 ${isPdfSelected(pdf.id) ? 'bg-blue-50' : ''}`}
                                            onClick={() => handleSelectPdf(pdf)}
                                        >
                                            <div className="flex items-center">
                                                <File size={16} className="mr-2 text-blue-600" />
                                                <span className="text-sm text-blue-800">{pdf.name}</span>
                                            </div>
                                            {isPdfSelected(pdf.id) && (
                                                <Check size={16} className="text-blue-600" />
                                            )}
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
                
                {selectedPdfs.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">
                        Please select at least one PDF source before generating the quiz.
                    </p>
                )}
            </div>
            
            <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
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
    );
};

export default GenerateQuizPage;