'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useStore';
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

const DisplayBattlesPage: React.FC = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const { user } = useAuthStore();

  const customMenuItems = [
    { label: 'My Battle', href: '/battle/enrollerdBattle' },
    { label: 'View Leaderboard', href: '/battle/leaderboard' },
    { label: 'join Battle', href: '/battle/viewAllBattle' },
  ];

  // Fetch all battles from the API
  useEffect(() => {
    const fetchBattles = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3600/api/battle/display-all');
        setBattles(response.data);
      } catch (error) {
        console.error("Error fetching battles", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBattles();
  }, []);

  // Handle battle selection
  const handleSelectBattle = (battle: Battle) => {
    setSelectedBattle(battle);
    setIsModalOpen(true);
  };

  // Handle joining the battle
  const handleJoinBattle = async () => {
    if (selectedBattle) {
      try {
        const response = await axios.post(
          `http://localhost:3600/api/battle/joinBattle/${selectedBattle._id}`,
          {
            userId: user?.id,
          }
        );
        alert(response.data.message);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error joining battle", error);
      }
    }
  };

  // Get unique battle types for filtering
  const battleTypes = ['all', ...Array.from(new Set(battles.map(battle => battle.type)))];

  // Filter battles based on search term and type
  const filteredBattles = battles.filter(battle => {
    const matchesSearch = battle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         battle.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || battle.type === filterType;
    return matchesSearch && matchesType;
  });

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

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Join Battle
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and join exciting battles to showcase your skills and compete with others!
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search battles by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              >
                {battleTypes.map(type => (
                  <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
                ))}
              </select>
              
              <button 
                onClick={() => {setSearchTerm(''); setFilterType('all');}}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Battle Cards */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin animation-delay-150"></div>
            </div>
            <span className="ml-4 text-gray-600 font-medium">Loading battles...</span>
          </div>
        ) : filteredBattles.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Battles Found</h2>
            <p className="text-gray-500">
              {battles.length === 0
                ? "There are no active battles available at the moment."
                : "No battles match your current search criteria."}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredBattles.map((battle) => (
              <motion.div
                key={battle._id}
                className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleSelectBattle(battle)}
              >
                <div className={`h-2 ${getBattleTypeColor(battle.type)}`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800 truncate">{battle.name}</h2>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {battle.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{battle.subject}</p>
                  
                  <div className="flex items-center space-x-4 mt-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>{battle.participants.length} Participants</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(battle.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 truncate max-w-[150px]" title={battle._id}>
                      ID: {battle._id.substring(0, 8)}...
                    </span>
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>Join Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Improved Modal */}
      {isModalOpen && selectedBattle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center mb-4">
              <div className={`w-2 h-10 rounded mr-3 ${getBattleTypeColor(selectedBattle.type)}`}></div>
              <h2 className="text-2xl font-bold text-gray-800">Join {selectedBattle.name}?</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-3">Battle details:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Subject:</span>
                  <span className="text-gray-800 font-medium">{selectedBattle.subject}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-800 font-medium">{selectedBattle.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Participants:</span>
                  <span className="text-gray-800 font-medium">{selectedBattle.participants.length}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">Are you sure you want to join this battle? You'll be able to participate and compete immediately.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors font-medium flex items-center"
                onClick={handleJoinBattle}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirm Join
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on battle type
function getBattleTypeColor(type: string): string {
  switch (type?.toLowerCase()) {
    case 'quiz':
      return 'bg-gradient-to-r from-blue-400 to-blue-600';
    case 'debate':
      return 'bg-gradient-to-r from-purple-400 to-purple-600';
    case 'tournament':
      return 'bg-gradient-to-r from-green-400 to-green-600';
    case 'challenge':
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    default:
      return 'bg-gradient-to-r from-blue-400 to-purple-600';
  }
}

export default DisplayBattlesPage;