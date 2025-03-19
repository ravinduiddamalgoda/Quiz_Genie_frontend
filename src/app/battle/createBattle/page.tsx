'use client';
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Button from '@mui/material/Button';

const CreateBattlePage: React.FC = () => {
    const notify = () => toast('Wow so easy !');

  const [battleName, setBattleName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [battleType, setBattleType] = useState('daily');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log({ battleName, subjectName, battleType });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              New Challenge
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Battle</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="battleName" className="block text-sm font-medium text-gray-700 mb-1">
                  Battle Name
                </label>
                <input
                  type="text"
                  id="battleName"
                  value={battleName}
                  onChange={(e) => setBattleName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="Enter a catchy battle name"
                />
              </div>
              
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700 mb-1">
                  Related Subject Name
                </label>
                <input
                  type="text"
                  id="subjectName"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="What is this battle about?"
                />
              </div>
              
              <div>
                <label htmlFor="battleType" className="block text-sm font-medium text-gray-700 mb-1">
                  Battle Type
                </label>
                <select
                  id="battleType"
                  value={battleType}
                  onChange={(e) => setBattleType(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors appearance-none bg-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div className="pt-2">
                {/* <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-md"
                    onClick={notify}
                >
                  Create Battle
                </button> */}
                <Button 
                    type="submit" 
                    variant="contained"
                    onClick={notify}
                    sx={{ width: '100%', bgcolor: 'indigo.600', '&:hover': { bgcolor: 'indigo.700' }}}
                >Create Battle</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateBattlePage;