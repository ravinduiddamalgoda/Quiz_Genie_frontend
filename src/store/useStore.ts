import { create } from 'zustand';

type BearStore = {
    bears: number;
    increase: () => void;
    decrease: () => void;
    reset: () => void;    
};

export const useBearStore = create<BearStore>((set) => ({
    bears: 0,
    increase: () => set((state) => ({ bears: state.bears + 1 })),
    decrease: () => set((state) => ({ bears: state.bears - 1 })),
    reset: () => set({ bears: 0 }),    
}));

type Student = {
    
    id: number;
    name: string;
    age: number;
};

export const useStudentStore = create<Student>((set) => ({
    id: 20,
    name: '',
    age: 0,
}));