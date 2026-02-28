import React from 'react';
import type { Theme } from '../../types';

interface MemoryGameProps {
    photos: string[];
    theme: Theme;
    onComplete: () => void;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete }) => {
    return <div onClick={onComplete}>Memory Game Placeholder</div>;
};
