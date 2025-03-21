import React from 'react';

interface Player {
  id: number;
  name: string;
  score: number;
  rank: number;
}

const players: Player[] = [
  { id: 1, name: "Iddamalgoda", score: 9850, rank: 1 },
  { id: 2, name: "Jane Smith", score: 8750, rank: 2 },
  { id: 3, name: "Alex Johnson", score: 7600, rank: 3 },
  { id: 4, name: "Sarah Williams", score: 6500, rank: 4 },
  { id: 5, name: "Mike Brown", score: 5400, rank: 5 },
  { id: 6, name: "Lisa Chen", score: 4300, rank: 6 },
  { id: 7, name: "David Wilson", score: 3200, rank: 7 },
  { id: 8, name: "Emily Davis", score: 2100, rank: 8 },
];

const getMedalColor = (rank: number): string => {
  switch (rank) {
    case 1: return "bg-yellow-500"; // Gold
    case 2: return "bg-gray-300";   // Silver
    case 3: return "bg-amber-700";  // Bronze
    default: return "";
  }
};

const Leaderboard: React.FC = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>
      
      <div className="space-y-4">
        {players.map((player) => (
          <div 
            key={player.id}
            className={`flex items-center p-3 rounded-md ${
              player.rank <= 3 ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-center w-8 h-8 mr-4">
              {player.rank <= 3 ? (
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-white ${getMedalColor(player.rank)}`}>
                  {player.rank}
                </span>
              ) : (
                <span className="text-gray-500">{player.rank}</span>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`font-medium ${player.rank <= 3 ? 'text-blue-700' : 'text-gray-700'}`}>
                {player.name}
              </h3>
            </div>
            
            <div className="text-right">
              <span className={`font-bold ${player.rank <= 3 ? 'text-blue-700' : 'text-gray-600'}`}>
                {player.score.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;