import React from 'react';
import { motion } from 'framer-motion';
import type { WishData } from '../types';
import { THEMES } from '../constants';

interface ExperiencePreviewProps {
    wishData: WishData;
    onBack: () => void;
}

const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const ExperiencePreview: React.FC<ExperiencePreviewProps> = ({ wishData, onBack }) => {
    const theme = THEMES[wishData.theme];

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme.colors.bg}, ${theme.colors.secondary})` }}
        >
            {/* Floating particles background */}
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: Math.random() * 12 + 3,
                        height: Math.random() * 12 + 3,
                        backgroundColor: theme.colors.accent,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0.05, 0.25, 0.05],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10 max-w-2xl w-full"
            >
                {/* Elegant sparkle divider */}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '120px' }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mx-auto mb-6 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.colors.accent}, transparent)` }}
                />

                {/* Title */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg tracking-[0.3em] uppercase text-white/70 font-light mb-3"
                >
                    Happy Birthday
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-6xl md:text-7xl font-bold text-white mb-2 drop-shadow-lg"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                    {wishData.name}
                </motion.h1>

                {wishData.age > 0 && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-2xl font-light mb-2"
                        style={{ color: theme.colors.accent }}
                    >
                        Turning {getOrdinalSuffix(wishData.age)} ✦
                    </motion.p>
                )}

                {/* Elegant sparkle divider */}
                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '80px' }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mx-auto mt-4 mb-10 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${theme.colors.accent}, transparent)` }}
                />

                {/* Photos — large and prominent */}
                {wishData.photos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className={`flex justify-center mb-10 ${wishData.photos.length === 1 ? 'gap-0' :
                                wishData.photos.length === 2 ? 'gap-5' : 'gap-4'
                            }`}
                    >
                        {wishData.photos.map((photo, i) => {
                            const rotation = wishData.photos.length === 1 ? 0 :
                                (i - Math.floor(wishData.photos.length / 2)) * 4;
                            const size = wishData.photos.length === 1 ? 'w-64 h-64' :
                                wishData.photos.length === 2 ? 'w-52 h-52' : 'w-44 h-44 md:w-52 md:h-52';
                            return (
                                <motion.div
                                    key={i}
                                    className={`${size} relative`}
                                    initial={{ opacity: 0, y: 40, rotate: rotation }}
                                    animate={{ opacity: 1, y: 0, rotate: rotation }}
                                    transition={{ delay: 0.9 + i * 0.15, type: 'spring', stiffness: 100 }}
                                    whileHover={{ scale: 1.08, rotate: 0, zIndex: 10 }}
                                >
                                    <img
                                        src={photo}
                                        alt={`Memory ${i + 1}`}
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl"
                                        style={{
                                            border: `3px solid rgba(255,255,255,0.3)`,
                                            boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${theme.colors.primary}30`,
                                        }}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20 max-w-lg mx-auto"
                >
                    <p className="text-white text-xl leading-relaxed font-light italic">
                        "{wishData.message}"
                    </p>
                </motion.div>

                {/* Placeholder notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="bg-black/15 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/10 max-w-md mx-auto"
                >
                    <p className="text-white/70 text-sm">
                        🎮 Preview mode — the full interactive experience with the Memory Unlock game,
                        3D cake, and blow-out candles is coming in Phase 4!
                    </p>
                </motion.div>

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBack}
                    className="py-3 px-8 bg-white/90 text-gray-800 rounded-lg font-semibold 
                     hover:bg-white transition-colors shadow-lg"
                >
                    ← Back to Share Screen
                </motion.button>
            </motion.div>
        </div>
    );
};
