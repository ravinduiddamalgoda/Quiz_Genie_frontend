'use client'// pages/quizBattle.tsx
import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { BackgroundBeamsWithCollision } from "@/app/component/background-beams-with-collision";
// import Link from 'next/link'
import { useRouter } from 'next/navigation'

const QuizBattle: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const router = useRouter()

  return (
    <div>
      <BackgroundBeamsWithCollision>
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-gray-800 font-sans tracking-tight">
          Challenge Your Mind,{" "}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27, 37, 80, 0.14))]">
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span className=""> Conquer the Leaderboard!</span>
            </div>
          </div>
          <br />
          <Button 
            className="rounded-xl py-3 px-6 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-200 transition-all duration-300"
            variant="contained" 
            onClick={handleOpen}
          >
            Let's go!
          </Button>
          
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-lg p-6 outline-none">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Please choose a category
              </h3>
              
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => router.push('/battle/createBattle')}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-md hover:shadow-purple-200 transition-all duration-300"
                >
                  Create a Battle
                </button>
                
                <button 
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-purple-600 bg-white border border-purple-500 hover:bg-purple-50 transition-all duration-300"
                >
                  Join Battle
                </button>
                
              </div>
            </div>
          </Modal>
        </h2>
      </BackgroundBeamsWithCollision>
    </div>
  );
};

export default QuizBattle;