import React, { createContext, useContext, useState, ReactNode } from 'react';

type Scenario = 'actual' | 'optimo' | 'eventos';

interface AnimationContextType {
  scenario: Scenario;
  isPlaying: boolean;
  speedMultiplier: number;
  setScenario: (scenario: Scenario) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSpeedMultiplier: (speed: number) => void;
  togglePlayPause: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};

interface AnimationProviderProps {
  children: ReactNode;
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
  const [scenario, setScenario] = useState<Scenario>('actual');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const value: AnimationContextType = {
    scenario,
    isPlaying,
    speedMultiplier,
    setScenario,
    setIsPlaying,
    setSpeedMultiplier,
    togglePlayPause,
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};
