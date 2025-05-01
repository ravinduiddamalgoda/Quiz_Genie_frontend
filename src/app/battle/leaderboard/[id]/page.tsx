'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '@/store/useStore';
import { useParams } from 'next/navigation';
import { jsPDF } from 'jspdf';

interface Player {
  id: string;
  name: string;
  totalScore: number;
  rank: number;
}

const Leaderboard: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  const [players, setPlayers] = useState<Player[]>([]);
  const { user, token } = useAuthStore(); // Accessing user and token from Zustand store
  const [userRank, setUserRank] = useState<number | null>(null); // State to store the logged-in user's rank

  useEffect(() => {
    if (!token) {
      console.log('No token found. Please log in.');
      return;
    }

    // Fetch leaderboard data from API
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`http://localhost:3600/api/leaderboard/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        // Access the leaderboard array from response.data
        if (response.data?.leaderboard && Array.isArray(response.data.leaderboard)) {
          const leaderboardData = response.data.leaderboard.map((entry: any, index: number) => ({
            id: entry.user?._id,
            name: entry.user?.name,
            totalScore: entry.totalScore,
            rank: index + 1, // Assigning the rank based on the position in the leaderboard
          }));
          setPlayers(leaderboardData);

          // Find the logged-in user's rank
          const loggedInUser: Player | undefined = leaderboardData.find((player: Player) => player.id === user?.id);
          setUserRank(loggedInUser ? loggedInUser.rank : null);
        } else {
          console.error('Leaderboard data is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data', error);
      }
    };

    fetchLeaderboard();
  }, [token, id, user?.id]); // Add user?.id as a dependency to refetch if it changes

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

  // We'll not use a hardcoded base64 since we have the direct file path
  // No need for background image state management since we're directly using the file from public folder

  // Function to create and download the certificate
  const downloadCertificate = () => {
    if (!user || userRank === null) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add background image using the correct path from your project structure
    try {
      // The path starts from the public folder, which is the root for static assets
      doc.addImage('/template.jpg', 'JPEG', 0, 0, 297, 210);
    } catch (e) {
      console.error("Error adding background image to PDF:", e);
      // Fallback to solid background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 297, 210, 'F');
    }

    // Add website name at the top with green color to match the background
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(76, 175, 80); // Green color matching the image
    doc.text('Quiz Genie', 148.5, 30, { align: 'center' });

    // Add certificate title with orange color to match the background
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(255, 152, 0); // Orange color matching the image
    doc.text('Certificate of Achievement', 148.5, 60, { align: 'center' });

    // No decorative line needed as the background has decorative elements

    // Add certificate text with dark text for readability
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33); // Dark gray for readability
    doc.text('This is to certify that', 148.5, 90, { align: 'center' });

    // Add name with emphasized styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(33, 33, 33); // Dark for readability
    doc.text(user.name || 'Player', 148.5, 110, { align: 'center' });

    // Add achievement details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(33, 33, 33);
    
    // Format the rank with ordinal suffix (1st, 2nd, 3rd, etc.)
    const getOrdinal = (n: number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    doc.text(`has achieved ${getOrdinal(userRank)} place`, 148.5, 130, { align: 'center' });
    doc.text(`on the Quiz Genie leaderboard`, 148.5, 145, { align: 'center' });

    // Add date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setFontSize(14);
    doc.text(`Issued on: ${formattedDate}`, 148.5, 165, { align: 'center' });

    // Add signature line
    doc.setDrawColor(76, 175, 80); // Green signature line
    doc.setLineWidth(0.5);
    doc.line(90, 180, 207, 180);
    doc.setFontSize(12);
    doc.text('Authorized Signature', 148.5, 188, { align: 'center' });
    
    // Add website URL at the bottom
    doc.setFontSize(10);
    doc.setTextColor(76, 175, 80); // Green to match theme
    doc.text('www.quizgenie.com', 148.5, 200, { align: 'center' });

    // Add QR code (optional)
    // Since you don't have a QR code image in your folder structure, this is commented out
    // If you want to add a QR code later, uncomment and provide the correct path
    /*
    try {
      // Generate QR code for the website or a verification URL
      doc.addImage('/qr-code.png', 'PNG', 25, 170, 30, 30);
      doc.setFontSize(8);
      doc.text('Scan to verify', 40, 205, { align: 'center' });
    } catch (e) {
      console.error("Error adding QR code:", e);
    }
    */
    
    // Save the PDF
    doc.save(`${user.name}_QuizGenie_certificate_rank_${userRank}.pdf`);
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

      {/* Display the logged-in user's rank */}
      <h1 className="mt-6 text-lg font-bold text-center">
        Your Rank: {userRank !== null ? userRank : 'Not Ranked'}
      </h1>

      {/* Download Certificate Button */}
      {userRank !== null && (
        <div className="mt-6 text-center">
          <button
            onClick={downloadCertificate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;