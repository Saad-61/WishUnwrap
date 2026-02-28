import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { WishData } from '../../types';
import { THEMES } from '../../constants';
import { Entrance } from './Entrance';
import { MemoryUnlock } from './MemoryUnlock';
import { CakeReveal } from './CakeReveal';

interface ExperienceProps {
    wishData: WishData;
}

type ExperienceStage = 'entrance' | 'game' | 'reveal';

export const Experience: React.FC<ExperienceProps> = ({ wishData }) => {
    const [stage, setStage] = useState<ExperienceStage>('entrance');
    const theme = THEMES[wishData.theme];

    return (
        <AnimatePresence mode="wait">
            {stage === 'entrance' && (
                <Entrance
                    key="entrance"
                    name={wishData.name}
                    theme={wishData.theme}
                    onStart={() => setStage('game')}
                />
            )}

            {stage === 'game' && (
                <MemoryUnlock
                    key="game"
                    photos={wishData.photos}
                    theme={theme}
                    onComplete={() => setStage('reveal')}
                />
            )}

            {stage === 'reveal' && (
                <CakeReveal
                    key="reveal"
                    wishData={wishData}
                    theme={theme}
                />
            )}
        </AnimatePresence>
    );
};
