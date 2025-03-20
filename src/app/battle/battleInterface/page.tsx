// app/page.tsx
'use client';

import React from 'react';
import SideDrawer from '@/app/component/sideDrawer';
import Questionnaire from '@/app/component/Questionnaire';



const Page: React.FC = () => {
  // You can customize the menu items if needed
  const customMenuItems = [
    { label: 'View Leaderboard', href: '/battle/leaderboard' },
    { label: 'Profile', href: '/profile' },
    { label: 'Settings', href: '/settings' },
    { label: 'Help', href: '/help' }
  ];

  //sample battle questions
  const sampleQuestions = [
    {
      id: 'q1',
      text: 'Which of the following programming languages have you used? (Select all that apply)',
      answers: [
        { id: 'a1', text: 'JavaScript' },
        { id: 'a2', text: 'Python' },
        { id: 'a3', text: 'Java' },
        { id: 'a4', text: 'C#' },
        { id: 'a5', text: 'TypeScript' }
      ]
    },
    {
      id: 'q2',
      text: 'Which front-end frameworks are you familiar with? (Select all that apply)',
      answers: [
        { id: 'a1', text: 'React' },
        { id: 'a2', text: 'Angular' },
        { id: 'a3', text: 'Vue' },
        { id: 'a4', text: 'Svelte' },
        { id: 'a5', text: 'Next.js' }
      ]
    },
    {
      id: 'q3',
      text: 'Which of these database systems have you worked with? (Select all that apply)',
      answers: [
        { id: 'a1', text: 'MySQL' },
        { id: 'a2', text: 'PostgreSQL' },
        { id: 'a3', text: 'MongoDB' },
        { id: 'a4', text: 'SQLite' },
        { id: 'a5', text: 'Firebase' }
      ]
    },
    {
      id: 'q4',
      text: 'Which cloud platforms have you used? (Select all that apply)',
      answers: [
        { id: 'a1', text: 'AWS' },
        { id: 'a2', text: 'Google Cloud' },
        { id: 'a3', text: 'Microsoft Azure' },
        { id: 'a4', text: 'Heroku' },
        { id: 'a5', text: 'Vercel' }
      ]
    }
  ];

  const handleSubmit = (responses: Record<string, string[]>) => {
    console.log('Questionnaire responses:', responses);
    // Here you can send the data to your API or perform other actions
    alert('Thank you for completing the questionnaire!');
  };

  return (
    <div className="relative min-h-screen">
      {/* Import and use the SideDrawer component */}
      <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      />

      {/* Main content */}
      {/* <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
        <p>Move your cursor to the left edge of the screen to open the drawer.</p>
        <div className="mt-4">
          <p>Your page content goes here...</p>
        </div>
      </div> */}
      <div>
      <Questionnaire 
        questions={sampleQuestions} 
        onSubmit={handleSubmit}
      />
    </div>
    </div>
  );
};

export default Page;