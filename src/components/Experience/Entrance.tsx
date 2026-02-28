import React from 'react';
import type { Theme } from '../../types';

interface EntranceProps {
    name: string;
    theme: Theme;
    onStart: () => void;
}

export const Entrance: React.FC<EntranceProps> = ({ onStart }) => {
    return <div onClick={onStart}>Entrance Placeholder</div>;
};
