// app/page.tsx
'use client';

import React from 'react';
import SideDrawer from '@/component/sideDrawer';
import Questionnaire from '@/component/Questionnaire';
import QuizPlayAction from '@/component/QuizPlayAction';



const Page: React.FC = () => {
  // Define custom menu items for the
  const customMenuItems = [
    { label: 'View Leaderboard', href: '/battle/leaderboard' },
    // { label: 'Profile', href: '/profile' },
    // { label: 'Settings', href: '/settings' },
    // { label: 'Help', href: '/help' }
  ];

  //sample battle
  const quizQuestions = [
    {
      id: 1,
      text: "ශ්‍රී ලංකාවේ අගරදගුරු තුමා තනතුරට පත් කෙරෙන්නේ කවුරු විසින්ද?",
      answers: [
        "අගමැතිතුමා විසින්",
        "ජනාධිපතිතුමා විසින්",
        "පාර්ලිමේන්තුව විසින්",
        "උසාවි ප්‍රධානිතුමා විසින්"
      ],
      correctAnswer: 1,
      difficulty: "EASY",
      language: "Sinhala"
    },
    {
      id: 2,
      text: "ආණ්ඩුක්‍රමයේ දේශපාලන බලය කෙලෙස වෙන් කෙරේ ද?",
      answers: [
        "ජනාධිපතිගේ අතින්",
        "පාර්ලිමේන්තුවේ අතින්",
        "නීතිඥයන්ගේ කාර්ය මණ්ඩලයක් අතින්",
        "ජනාධිපතිගේ සහ පාර්ලිමේන්තුවේ අතින්"
      ],
      correctAnswer: 3,
      difficulty: "EASY",
      language: "Sinhala"
    },
    {
      id: 3,
      text: "ශ්‍රී ලංකාවේ ආණ්ඩුක්‍රමය අනුව, ජනාධිපති ධුරය පුරුෂාර්ථය කාලය කොපමණ වේද?",
      answers: [
        "අවුරුදු 4ක්",
        "අවුරුදු 5ක්",
        "අවුරුදු 6ක්",
        "අවුරුදු 7ක්"
      ],
      correctAnswer: 1,
      difficulty: "EASY",
      language: "Sinhala"
    },
    {
      id: 4,
      text: "අයවැය සංශෝධනයක් පාර්ලිමේන්තුවේ සම්මත වීම සඳහා අවශ්‍ය ඡන්ද බහුතරය කුමක්ද?",
      answers: [
        "සරල බහුතරය",
        "තුනෙන් දෙකේ බහුතරය",
        "පාර්ලිමේන්තු සාමාජිකයන්ගේ තුනෙන් එකේ බහුතරය",
        "පාර්ලිමේන්තු සාමාජිකයන්ගේ පහකින් තුනක බහුතරය"
      ],
      correctAnswer: 1,
      difficulty: "MEDIUM",
      language: "Sinhala"
    },
    {
      id: 5,
      text: "ශ්‍රී ලංකාවේ අගරදගුරුවරයාගේ ධුරය සඳහා කාලයක් නියමිත වනුයේ කොපමණ කාලයක්ද?",
      answers: [
        "අවුරුදු 4ක්",
        "අවුරුදු 5ක්",
        "අවුරුදු 6ක්",
        "අවුරුදු 7ක්"
      ],
      correctAnswer: 1,
      difficulty: "MEDIUM",
      language: "Sinhala"
    },
    {
      id: 6,
      text: "සංවිධානය අනුව, අගමැතිගේ ධුරය අවසන් කළ හැක්කේ කුමන අවස්ථාවලදීද?",
      answers: [
        "ජනපති තීන්දු කළ විට",
        "පාර්ලිමේන්තුව නව අගමැති පත් කළ විට",
        "පාර්ලිමේන්තුව විශ්වාසභංගයක් පාස් කළ විට",
        "ජනතා මතය ප්‍රකාශ කළ විට"
      ],
      correctAnswer: 2,
      difficulty: "MEDIUM",
      language: "Sinhala"
    },
    {
      id: 7,
      text: "සම්මත නීතියෙහි විධායක බලතල යටතේ ජනාධිපතිගේ බලතල සියල්ල වර්තා කරන්නේ කුමන ලේඛනයේද?",
      answers: [
        "ප්‍රජාතන්ත්‍ර නීති ලේඛනය",
        "නීති මාලාව",
        "අධිකරණ සංවිධාන ලේඛනය",
        "විධායක නීති ලේඛනය"
      ],
      correctAnswer: 3,
      difficulty: "HARD",
      language: "Sinhala"
    },
    {
      id: 8,
      text: "ශ්‍රී ලංකාවේ ආරක්ෂා සේවාවන්හි ඉහළම නිලධාරීයා කවුරුන්ද?",
      answers: [
        "අගමැති",
        "ජනාධිපති",
        "රජයේ ලේකම්",
        "ආරක්ෂක ලේකම්"
      ],
      correctAnswer: 1,
      difficulty: "HARD",
      language: "Sinhala"
    },
    {
      id: 9,
      text: "ශ්‍රී ලංකාවේ ආරක්ෂක සේවාවන් වෙත අදාළව සංවිධාන පත්‍රයේ කුමන වගන්තිය යටතේ ජනාධිපතිට ඒවායේ උපරිම උපදේශක හා නියෝජිත ලෙස හැසිරීමේ බලය ලබා දී ඇත්ද?",
      answers: [
        "ඡන්ද පත්‍රයේ පනවා ඇති වගන්තිය",
        "දේශපාලන වගන්තිය",
        "සංවිධාන පත්‍රයේ 4 වන වගන්තිය",
        "අභියෝගාත්මක වගන්තිය"
      ],
      correctAnswer: 2,
      difficulty: "HARD",
      language: "Sinhala"
    },
    {
      id: 10,
      text: "සංවිධානය අනුව පාර්ලිමේන්තුව විසින් අක්‍රිය කළ නොහැකි නීතියක් වන්නේ කුමක්ද?",
      answers: [
        "ජාතික ආරක්ෂාව පිළිබඳ නීති",
        "ගණුදෙනුකර නීති",
        "මහ පරිමාණ සාමාන්‍ය නීති",
        "මූලික අයිතියන් සහ නිදහස් ගැනීම් පිළිබඳ නීති"
      ],
      correctAnswer: 3,
      difficulty: "HARD",
      language: "Sinhala"
    }
  ];
  

  const handleSubmit = (responses: Record<string, string[]>) => {
    console.log('Questionnaire responses:', responses);
    //send the data to API or perform other actions
    alert('Thank you for completing the questionnaire!');
  };

  return (
    <div className="relative min-h-screen">
      {/* Import and use the SideDrawer component */}
      {/* <SideDrawer 
        menuItems={customMenuItems} 
        title="Battle Menu" 
        exitButtonText="leave Battle"
      /> */}

      {/* Main content */}
      {/* <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
        <p>Move your cursor to the left edge of the screen to open the drawer.</p>
        <div className="mt-4">
          <p>Your page content goes here...</p>
        </div>
      </div> */}
      <div>
      {/* <Questionnaire 
        questions={sampleQuestions} 
        onSubmit={handleSubmit}
      /> */}

      <QuizPlayAction questions={quizQuestions} />
    </div>
    </div>
  );
};

export default Page;