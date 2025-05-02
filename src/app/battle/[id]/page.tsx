'use client'

import React, { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
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

const SingleBattleInterface: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [battle, setBattle] = useState<Battle | null>(null);
  const [leaderboard, setLeaderboard] = useState<Battle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const customMenuItems = [
    { label: 'My Battle', href: '/battle/enrollerdBattle' },
    { label: 'join Battle', href: '/battle/viewAllBattle' },
  ];

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
      const fetchBattleDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:3600/api/leaderboard/${id}`);
          console.log('Battle Details Response:', response.data);
          setLeaderboard(response.data);
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



  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'N/A' : date.toISOString().split('T')[0];
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading battle details...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!battle) {
    return <div className="p-4">Battle not found</div>;
  }

  return (
    <div className="p-4">
      {/* <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      /> */}
      <h1 className="text-3xl font-bold mb-6">{battle.name}</h1>

      {/* Buttons for Leaderboard and Quiz */}
      <div className="flex gap-4">
        <button
          onClick={() => window.location.href = `/battle/leaderboard/${id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          View Leaderboard
        </button>
        <button
          onClick={() => window.location.href = `/battle/quiz/[id]?battleId=${id}`}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Attempt Quiz
        </button>
      </div>
    </div>
  );
};

export default SingleBattleInterface;