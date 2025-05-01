'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useStore';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { user, token } = useAuthStore(); // Accessing user and token from Zustand store

  useEffect(() => {
    if (!token) {
      console.log('No token found. Please log in.');
      return;
    }

    // Fetch leaderboard data from API
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:3600/api/leaderboard/68138c08af9e18033d047509', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        // console.log('Response Data:', response.data); // Log the response data to inspect

        // Access the leaderboard array from response.data
        if (response.data?.leaderboard && Array.isArray(response.data.leaderboard)) {
          const leaderboardData = response.data.leaderboard.map((entry: any, index: number) => ({
            id: entry.user?._id,
            name: entry.user?.name,
            totalScore: entry.totalScore,
            rank: index + 1, // Assigning the rank based on the position in the leaderboard
          }));
          setPlayers(leaderboardData);
        } else {
          console.error('Leaderboard data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data', error);
      }
    };

    fetchLeaderboard();
  }, [token]); // Add token as a dependency to refetch if it changes

  const getMedalColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500'; // Gold
      case 2:
        return 'bg-gray-300'; // Silver
      case 3:
        return 'bg-amber-700'; // Bronze
      default:
        return '';
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>

      <div className="space-y-4">
        {players.length > 0 ? (
          players.map((player) => (
            <div
              key={player.id} // Ensure that each child has a unique key
              className={`flex items-center p-3 rounded-md ${
                player.rank <= 3 ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-center w-8 h-8 mr-4">
                {player.rank <= 3 ? (
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-white ${getMedalColor(
                      player.rank
                    )}`}
                  >
                    {player.rank}
                  </span>
                ) : (
                  <span className="text-gray-500">{player.rank}</span>
                )}
              </div>

              <div className="flex-1">
                <h3
                  className={`font-medium ${player.rank <= 3 ? 'text-blue-700' : 'text-gray-700'}`}
                >
                  {player.name}
                </h3>
              </div>

              <div className="text-right">
                <span
                  className={`font-bold ${player.rank <= 3 ? 'text-blue-700' : 'text-gray-600'}`}
                >
                  {player.totalScore.toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading leaderboard...</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
