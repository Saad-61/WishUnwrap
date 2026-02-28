import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WishData } from '../types';
import { THEMES } from '../constants';
import { MemoryUnlock } from './Experience/MemoryUnlock';
import { CakeReveal } from './Experience/CakeReveal';

interface ExperiencePreviewProps {
    wishData: WishData;
    onBack: () => void;
}

const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

type ExperienceSection = 'entrance' | 'memory' | 'cake';

export const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({ wishData, onBack }) => {
    const theme = THEMES[wishData.theme];
    const [section, setSection] = React.useState<ExperienceSection>('entrance');

    const [particles] = React.useState(() =>
        [...Array(35)].map(() => ({
            width: Math.random() * 8 + 3,
            height: Math.random() * 8 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 5 + 3,
            delay: Math.random() * 3,
        }))
    );

    // === MEMORY MATCH SECTION ===
    if (section === 'memory' && wishData.photos.length > 0) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="memory"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <MemoryUnlock
                        photos={wishData.photos}
                        theme={theme}
                        onComplete={() => setSection('cake')}
                    />
                </motion.div>
            </AnimatePresence>
        );
    }

    // === CAKE REVEAL SECTION ===
    if (section === 'cake') {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key="cake"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <CakeReveal wishData={wishData} theme={theme} />
                </motion.div>
            </AnimatePresence>
        );
    }

    // === ENTRANCE SECTION (no photos) ===
    const handleStart = () => {
        if (wishData.photos.length > 0) {
            setSection('memory');
        } else {
            setSection('cake');
        }
    };

    const ageText = wishData.age > 0
        ? `Happy ${getOrdinalSuffix(wishData.age)} Birthday`
        : 'Happy Birthday';

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${theme.colors.bg}, ${theme.colors.primary}18, ${theme.colors.bg})`,
            }}
        >
            {/* Floating particles */}
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        width: p.width,
                        height: p.height,
                        backgroundColor: theme.colors.accent,
                        left: p.left,
                        top: p.top,
                        opacity: 0.15,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.08, 0.2, 0.08],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                    }}
                />
            ))}

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center z-10 w-full max-w-3xl"
            >
                {/* Decorative top line */}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '140px' }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="mx-auto mb-6 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.colors.accent}, transparent)` }}
                />

                {/* Combined title: "Happy 1st Birthday" */}
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl md:text-3xl font-handwriting-alt mb-3"
                    style={{ color: theme.colors.accent }}
                >
                    {ageText}
                </motion.p>

                {/* NAME — huge handwriting */}
                <motion.h1
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
                    className="text-7xl md:text-8xl lg:text-9xl font-handwriting mb-6"
                    style={{
                        color: theme.colors.primary,
                        textShadow: `0 4px 25px ${theme.colors.primary}40, 0 0 80px ${theme.colors.accent}15`,
                    }}
                >
                    {wishData.name}
                </motion.h1>

                {/* Decorative emojis */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center gap-4 mb-8 text-3xl"
                >
                    {['🎂', '🎈', '✨', '🎁', '🎉'].map((emoji, i) => (
                        <motion.span
                            key={i}
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                            }}
                        >
                            {emoji}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Decorative bottom line */}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100px' }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mx-auto mb-10 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.colors.accent}, transparent)` }}
                />

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStart}
                    className="py-4 px-12 rounded-full font-handwriting text-2xl text-white shadow-xl transition-all"
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                        boxShadow: `0 8px 35px ${theme.colors.primary}50`,
                    }}
                >
                    {wishData.photos.length > 0 ? '✨ Unwrap Memories' : '✨ See Your Surprise'}
                </motion.button>

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="block mx-auto mt-5 py-2 px-6 text-sm rounded-lg font-display transition-colors"
                    style={{
                        color: theme.colors.text || '#666',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                    }}
                >
                    ← Back
                </motion.button>
            </motion.div>
        </div>
    );
};
