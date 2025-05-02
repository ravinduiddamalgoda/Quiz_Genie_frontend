'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SideDrawer from '@/component/sideDrawer';
import { motion } from 'framer-motion';

interface Battle {
  _id: string;
  name: string;
  subject: string;
  type: string;
  admin: string;
  participants: string[];
  createdAt: string;
}

interface Participant {
  name: string;
  score: number;
  avatar?: string;
}

const SingleBattleInterface: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [leaderboard, setLeaderboard] = useState<Battle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const customMenuItems = [
    { label: 'My Battle', href: '/battle/enrollerdBattle' },
    { label: 'join Battle', href: '/battle/viewAllBattle' },
  ];

  // Mock participants data for UI demonstration
  // const mockParticipants: Participant[] = [
  //   { name: 'Alex Johnson', score: 850, avatar: 'A' },
  //   { name: 'Sarah Miller', score: 720, avatar: 'S' },
  //   { name: 'Michael Chen', score: 690, avatar: 'M' },
  //   { name: 'Taylor Swift', score: 640, avatar: 'T' },
  //   { name: 'Jordan Lee', score: 580, avatar: 'J' },
  // ];
  const [mockParticipants, setMockParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (id) {
      const fetchLeaderboardDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3600/api/leaderboard/${id}`);
          console.log('Leaderboard Details Response:', response.data);

          // Map the response data to the mockParticipants structure
          const participants = response.data.leaderboard.map((entry: any) => ({
            name: entry.user.name,
            score: entry.totalScore,
          }));

          setMockParticipants(participants);
          setError(null);
        } catch (err) {
          console.error('Error fetching leaderboard details:', err);
          setError('Failed to load leaderboard details');
        } finally {
          setLoading(false);
        }
      };

      fetchLeaderboardDetails();
    }
  }, [id]);


  useEffect(() => {
    if (id) {
      const fetchBattleDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3600/api/battle/${id}`);
          console.log('Battle Details Response:', response.data);
          setBattle(response.data);
          setError(null);
        } catch (err) {
          console.error("Error fetching battle details:", err);
          setError("Failed to load battle details");
        } finally {
          setLoading(false);
        }
      };

      fetchBattleDetails();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const fetchLeaderboardDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3600/api/leaderboard/${id}`);
          console.log('Leaderboard Details Response:', response.data);
          setLeaderboard(response.data);
        } catch (err) {
          console.error("Error fetching leaderboard details:", err);
          // Don't set error here to not interrupt the main UI if leaderboard fails
        }
      };

      fetchLeaderboardDetails();
    }
  }, [id]);

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getBattleTypeColor = (type: string | undefined): string => {
    if (!type) return 'bg-blue-600';
    
    switch (type.toLowerCase()) {
      case 'quiz':
        return 'bg-blue-600';
      case 'debate':
        return 'bg-purple-600';
      case 'tournament':
        return 'bg-green-600';
      case 'challenge':
        return 'bg-yellow-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getBattleTypeGradient = (type: string | undefined): string => {
    if (!type) return 'from-blue-500 to-blue-700';
    
    switch (type.toLowerCase()) {
      case 'quiz':
        return 'from-blue-500 to-blue-700';
      case 'debate':
        return 'from-purple-500 to-purple-700';
      case 'tournament':
        return 'from-green-500 to-green-700';
      case 'challenge':
        return 'from-yellow-500 to-yellow-700';
      default:
        return 'from-blue-500 to-blue-700';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading battle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Battle Not Found</h2>
          <p className="text-gray-600 mb-4">The battle you are looking for doesn't exist or may have been removed.</p>
          <button 
            onClick={() => window.location.href = '/battle/viewAllBattle'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Battles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Battle Header */}
          <div className={`bg-gradient-to-r ${getBattleTypeGradient(battle.type)} text-white p-6 md:p-8`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center">
                  <span className="inline-block px-3 py-1 text-blue-900 bg-white bg-opacity-20 rounded-full text-sm font-medium mr-3">
                    {battle.type || 'Battle'}
                  </span>
                  <span className="text-sm">{formatDate(battle.createdAt)}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mt-2">{battle.name}</h1>
                <p className="mt-2 text-white text-opacity-90">{battle.subject}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center">
                  <div className="text-sm text-blue-900 font-medium">Participants</div>
                  <div className="text-2xl text-blue-900 font-bold">{battle.participants?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 mx-2 text-sm font-medium border-b-2 ${
                  activeTab === 'overview' 
                    ? `border-${getBattleTypeColor(battle.type).replace('bg-', '')} text-${getBattleTypeColor(battle.type).replace('bg-', '')}` 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`px-4 py-3 mx-2 text-sm font-medium border-b-2 ${
                  activeTab === 'participants' 
                    ? `border-${getBattleTypeColor(battle.type).replace('bg-', '')} text-${getBattleTypeColor(battle.type).replace('bg-', '')}` 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Participants
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-4 py-3 mx-2 text-sm font-medium border-b-2 ${
                  activeTab === 'actions' 
                    ? `border-${getBattleTypeColor(battle.type).replace('bg-', '')} text-${getBattleTypeColor(battle.type).replace('bg-', '')}`
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Actions
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants} className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Battle Details</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm">Subject</p>
                        <p className="font-medium text-gray-800">{battle.subject}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Type</p>
                        <p className="font-medium text-gray-800">{battle.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Created</p>
                        <p className="font-medium text-gray-800">{formatDate(battle.createdAt)}</p>
                      </div>
                      {/* <div>
                        <p className="text-gray-500 text-sm">Battle ID</p>
                        <p className="font-medium text-gray-800 truncate" title={battle._id}>{battle._id}</p>
                      </div> */}
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Leaderboard Preview</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {mockParticipants.slice(0, 3).map((participant, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-white font-medium text-xs ${
                                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                                }`}>
                                  {index + 1}
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  {/* <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getBattleTypeColor(battle.type)} flex items-center justify-center text-white font-medium`}>
                                    {participant.avatar}
                                  </div> */}
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">{participant.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 text-center">
                      <button
                        onClick={() => window.location.href = `/battle/leaderboard/${id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Full Leaderboard →
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'participants' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Participants</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {battle.participants && battle.participants.length > 0 ? (
                        mockParticipants.map((participant, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                            {/* <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getBattleTypeColor(battle.type)} flex items-center justify-center text-white font-medium`}>
                              {participant.avatar}
                            </div> */}
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                              <div className="text-xs text-gray-500">Score: {participant.score}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center p-4">
                          <p className="text-gray-500">No participants have joined this battle yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'actions' && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">View Leaderboard</h3>
                  <p className="text-gray-600 mb-4">Check the current standings and see who's leading in this battle.</p>
                  <button
                    onClick={() => window.location.href = `/battle/leaderboard/${id}`}
                    className={`w-full py-2 rounded-lg bg-gradient-to-r ${getBattleTypeGradient(battle.type)} text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center`}
                  >
                    <span>Leaderboard</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Attempt Quiz</h3>
                  <p className="text-gray-600 mb-4">Take the quiz challenge and earn points to climb the leaderboard.</p>
                  <button
                    onClick={() => window.location.href = `/battle/quiz/[id]?battleId=${id}`}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <span>Start Quiz</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Upload Quiz</h3>
                  <p className="text-gray-600 mb-4">Upload your own quiz submissions for this battle challenge.</p>
                  <button
                    onClick={() => window.location.href = `/battle/quiz/upload/${id}`}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <span>Upload Submission</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Leave Battle</h3>
                  <p className="text-gray-600 mb-4">Exit this battle and return to the battle selection screen.</p>
                  <button
                    onClick={() => window.location.href = `/battle/viewAllBattle`}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    <span>Leave Battle</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SingleBattleInterface;