import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/api';

//Student Store
//
type Student = {
  id: number;
  name: string;
  age: number;
};

type StudentStore = Student & {
  setStudent: (student: Student) => void;
  updateName: (name: string) => void;
  updateAge: (age: number) => void;
};

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
  correctAnswer: string;
  difficulty: string;
  language: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  totalQuestions: number;
}

export interface QuizAttempt {
  quizId: string;
  responses: Record<number, string>;
  startTime: Date;
  endTime?: Date;
}

interface QuizStore {
  // Current quiz being viewed or played
  currentQuiz: Quiz | null;
  
  // Current quiz attempt in progress
  currentAttempt: QuizAttempt | null;
  
  // History of recently played quizzes
  recentQuizzes: string[];
  
  // Actions
  setCurrentQuiz: (quiz: Quiz) => void;
  clearCurrentQuiz: () => void;
  
  startQuizAttempt: (quizId: string) => void;
  setQuestionResponse: (questionId: number, optionId: string) => void;
  finishQuizAttempt: () => QuizAttempt;
  clearQuizAttempt: () => void;
  
  addToRecentQuizzes: (quizId: string) => void;
  clearRecentQuizzes: () => void;
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      currentQuiz: null,
      currentAttempt: null,
      recentQuizzes: [],
      
      setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
      clearCurrentQuiz: () => set({ currentQuiz: null }),
      
      startQuizAttempt: (quizId) => set({
        currentAttempt: {
          quizId,
          responses: {},
          startTime: new Date(),
        }
      }),
      
      setQuestionResponse: (questionId, optionId) => set((state) => ({
        currentAttempt: state.currentAttempt ? {
          ...state.currentAttempt,
          responses: {
            ...state.currentAttempt.responses,
            [questionId]: optionId
          }
        } : null
      })),
      
      finishQuizAttempt: () => {
        const state = get();
        const currentAttempt = state.currentAttempt;
        
        if (!currentAttempt) {
          throw new Error('No active quiz attempt');
        }
        
        const completedAttempt = {
          ...currentAttempt,
          endTime: new Date()
        };
        
        // Add to recent quizzes
        get().addToRecentQuizzes(currentAttempt.quizId);
        
        // Clear current attempt
        set({ currentAttempt: null });
        
        return completedAttempt;
      },
      
      clearQuizAttempt: () => set({ currentAttempt: null }),
      
      addToRecentQuizzes: (quizId) => set((state) => {
        // Add to the beginning and keep only the 10 most recent
        const filteredQuizzes = state.recentQuizzes.filter(id => id !== quizId);
        const updatedQuizzes = [quizId, ...filteredQuizzes].slice(0, 10);
        
        return { recentQuizzes: updatedQuizzes };
      }),
      
      clearRecentQuizzes: () => set({ recentQuizzes: [] }),
    }),
    {
      name: 'quiz-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      
      // Optionally, you can specify which parts of the state to persist
      partialize: (state) => ({
        recentQuizzes: state.recentQuizzes,
        // Don't persist current quiz or attempt
      }),
    }
  )
);

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      id: 0,
      name: '',
      age: 0,
      setStudent: (student) => set({ ...student }),
      updateName: (name) => set((state) => ({ ...state, name })),
      updateAge: (age) => set((state) => ({ ...state, age })),
    }),
    {
      name: 'student-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

//
// 🔐 Auth Store
//
type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);

