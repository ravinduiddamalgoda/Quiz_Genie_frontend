'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useStore';
import SideDrawer from '@/component/sideDrawer';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  
  const customMenuItems = [
    { label: 'My Battle', href: '/battle/enrollerdBattle' },
    { label: 'join Battle', href: '/battle/viewAllBattle' },
  ];

  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      const fetchUserBattles = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`http://localhost:3600/api/battle/getUserBattles/${user.id}`);
          setBattles(response.data);
        } catch (error) {
          console.error("Error fetching user battles", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserBattles();
    }
  }, [user?.id]);

  const handleSelectBattle = (battle: Battle) => {
    setSelectedBattle(battle);
    router.push(`/battle/${battle._id}`);
  };

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  const filteredBattles = battles
    .filter(battle => battle.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      battle.subject.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(battle => filterType === 'all' ? true : battle.type === filterType);

  const battleTypes = [...new Set(battles.map(battle => battle.type))];

  // Card variants for animations
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
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            Your Enrolled Battles
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage all the battles you've joined. Click on any battle card to enter the arena.
          </p>
        </div>

        {/* Search and filter section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-md">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            >
              <option value="all">All Types</option>
              {battleTypes.map(type => (
                <option key={type} value={type}>{type}</option>
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 border-t-blue-500 animate-spin"></div>
          </div>
        ) : filteredBattles.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Battles Found</h2>
            <p className="text-gray-500">
              {battles.length === 0
                ? "You are not enrolled in any battles yet. Join a battle to get started!"
                : "No battles match your current search and filter criteria."}
            </p>
            {battles.length === 0 && (
              <button 
                onClick={() => router.push('/battle/viewAllBattle')}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Battles
              </button>
            )}
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
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleSelectBattle(battle)}
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-gray-800 truncate">{battle.name}</h2>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {battle.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{battle.subject}</p>
                  
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{battle.participants.length} Participants</span>
                  </div>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Created: {formatDate(battle.createdAt)}</span>
                  </div>
                  
                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400">ID: {battle._id.substring(0, 8)}...</span>
                    <span className="text-blue-600 text-sm font-medium hover:underline">
                      Enter Battle →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedBattle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Join {selectedBattle.name}?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to join this battle? Once you join, you'll be able to participate in all activities.</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleJoinBattle}
              >
                Confirm Join
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DisplayBattlesPage;