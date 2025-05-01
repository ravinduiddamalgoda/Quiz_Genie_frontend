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