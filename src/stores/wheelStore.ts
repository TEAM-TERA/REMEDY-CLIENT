import { create } from 'zustand';

type WheelState = {
  wheelIndex: number;
  wheelRotation: number; // degrees
  setWheelIndex: (index: number) => void;
  setWheelRotation: (deg: number) => void;
};

export const useWheelStore = create<WheelState>((set) => ({
  wheelIndex: 0,
  wheelRotation: 0,
  setWheelIndex: (wheelIndex) => set({ wheelIndex }),
  setWheelRotation: (wheelRotation) => set({ wheelRotation }),
}));
