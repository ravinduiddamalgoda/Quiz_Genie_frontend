'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useStore';  // Importing Zustand store
import SideDrawer from '@/component/sideDrawer';

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

  const customMenuItems = [
    { label: 'My Battle', href: '/battle/enrollerdBattle' },
    { label: 'View Leaderboard', href: '/battle/leaderboard' },
    { label: 'join Battle', href: '/battle/viewAllBattle' },
    // { label: 'Settings', href: '/settings' },
    // { label: 'Help', href: '/help' }
  ];

  // Accessing user ID from Zustand store
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      // Fetch user-specific battles
      const fetchUserBattles = async () => {
        try {
          const response = await axios.get(`http://localhost:3600/api/battle/getUserBattles/${user.id}`);
          setBattles(response.data);  // Set the battles of the logged-in user
        } catch (error) {
          console.error("Error fetching user battles", error);
        }
      };
      fetchUserBattles();
    }
  }, [user?.id]);  // Dependency on user ID

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
            userId: user?.id,  // Using the logged-in user ID
          }
        );
        alert(response.data.message);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error joining battle", error);
      }
    }
  };

  return (
    <div className="p-4">
        <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      />
      <h1 className="text-3xl font-bold mb-6">Your Enrolled Battles</h1>
      {battles.length === 0 ? (
        <p className="text-gray-500">You are not enrolled in any battles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {battles.map((battle) => (
            <div
              key={battle._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleSelectBattle(battle)}
            >
              <h2 className="text-xl font-semibold">{battle.name}</h2>
              <p className="text-gray-600">{battle.subject}</p>
              <p className="text-gray-500">{battle.type}</p>
              <p className="text-sm text-gray-400">Created At: {new Date(battle.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && selectedBattle && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Join {selectedBattle.name}?</h2>
            <p className="text-gray-700">Are you sure you want to join this battle?</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={handleJoinBattle}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayBattlesPage;
