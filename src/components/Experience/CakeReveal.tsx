import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WishData, ThemeConfig } from '../../types';

interface CakeRevealProps {
    wishData: WishData;
    theme: ThemeConfig;
}

const getOrdinalSuffix = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const CakeReveal: React.FC<CakeRevealProps> = ({ wishData, theme }) => {
    const candleCount = Math.min(Math.max(wishData.age || 3, 1), 7);
    const [litCandles, setLitCandles] = useState<boolean[]>(new Array(candleCount).fill(true));
    const [isBlowing, setIsBlowing] = useState(false);
    const [allBlownOut, setAllBlownOut] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    // Pre-compute confetti from LEFT and RIGHT poppers
    const [confettiPieces] = useState(() => {
        const pieces: Array<{
            startX: number; startY: number;
            endX: number; endY: number;
            rotation: number; duration: number; delay: number;
            color: string; size: number;
        }> = [];

        const colors = [theme.colors.primary, theme.colors.accent, theme.colors.secondary, '#fff', '#FFB6C1', '#FF69B4'];

        // Left popper (shoots up-right then falls)
        for (let i = 0; i < 25; i++) {
            pieces.push({
                startX: -20 + Math.random() * 60,
                startY: 50 + Math.random() * 30,
                endX: 10 + Math.random() * 45,
                endY: 80 + Math.random() * 25,
                rotation: Math.random() * 1080,
                duration: 2 + Math.random() * 1.5,
                delay: Math.random() * 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 6 + Math.random() * 8,
            });
        }

        // Right popper (shoots up-left then falls)
        for (let i = 0; i < 25; i++) {
            pieces.push({
                startX: 80 + Math.random() * 40,
                startY: 50 + Math.random() * 30,
                endX: 45 + Math.random() * 45,
                endY: 80 + Math.random() * 25,
                rotation: -(Math.random() * 1080),
                duration: 2 + Math.random() * 1.5,
                delay: Math.random() * 0.3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 6 + Math.random() * 8,
            });
        }

        return pieces;
    });

    // Blow out candles
    useEffect(() => {
        if (!isBlowing) return;
        const interval = setInterval(() => {
            setLitCandles(prev => {
                const newCandles = [...prev];
                const litIndex = newCandles.indexOf(true);
                if (litIndex !== -1) newCandles[litIndex] = false;
                if (!newCandles.includes(true)) {
                    setAllBlownOut(true);
                    clearInterval(interval);
                }
                return newCandles;
            });
        }, 350);
        return () => clearInterval(interval);
    }, [isBlowing]);

    // After blow-out: confetti then message
    useEffect(() => {
        if (!allBlownOut) return;
        setShowConfetti(true);
        const t = setTimeout(() => setShowMessage(true), 1500);
        return () => clearTimeout(t);
    }, [allBlownOut]);

    // Typewriter
    useEffect(() => {
        if (!showMessage) return;
        const msg = wishData.message;
        let i = 0;
        const timer = setInterval(() => {
            if (i <= msg.length) {
                setDisplayedMessage(msg.slice(0, i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 40);
        return () => clearInterval(timer);
    }, [showMessage, wishData.message]);

    const handlePointerDown = useCallback(() => {
        if (!allBlownOut) setIsBlowing(true);
    }, [allBlownOut]);

    const handlePointerUp = useCallback(() => {
        setIsBlowing(false);
    }, []);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden select-none"
            style={{ background: `linear-gradient(180deg, ${theme.colors.bg}, ${theme.colors.primary}10)` }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {/* CONFETTI POPPERS — from left and right sides */}
            <AnimatePresence>
                {showConfetti && confettiPieces.map((piece, i) => (
                    <motion.div
                        key={`confetti-${i}`}
                        className="absolute pointer-events-none"
                        style={{
                            width: piece.size,
                            height: piece.size,
                            backgroundColor: piece.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                            left: `${piece.startX}%`,
                            top: `${piece.startY}%`,
                        }}
                        animate={{
                            left: [`${piece.startX}%`, `${piece.endX}%`],
                            top: [`${piece.startY}%`, `${piece.startY - 30 - Math.random() * 20}%`, `${piece.endY}%`],
                            rotate: piece.rotation,
                            opacity: [1, 1, 0],
                        }}
                        transition={{
                            duration: piece.duration,
                            delay: piece.delay,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6 z-10"
            >
                <p
                    className="text-base tracking-[0.25em] uppercase mb-2 font-display"
                    style={{ color: theme.colors.secondary }}
                >
                    Make a wish
                </p>
                <h2
                    className="text-4xl md:text-5xl font-handwriting"
                    style={{ color: theme.colors.primary }}
                >
                    {allBlownOut
                        ? (wishData.age > 0
                            ? `Happy ${getOrdinalSuffix(wishData.age)} Birthday!`
                            : 'Happy Birthday!')
                        : 'Blow the Candles!'}
                </h2>
            </motion.div>

            {/* CAKE — Better design */}
            <motion.div
                className="relative z-10 mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
            >
                <div className="relative flex flex-col items-center">
                    {/* Candles row */}
                    <div className="flex justify-center gap-5 mb-0 relative z-20">
                        {litCandles.map((isLit, i) => (
                            <div key={i} className="flex flex-col items-center">
                                {/* Flame / smoke */}
                                <div className="h-8 flex items-end justify-center">
                                    <AnimatePresence mode="wait">
                                        {isLit ? (
                                            <motion.div
                                                key="flame"
                                                className="relative"
                                                exit={{ opacity: 0, scale: 0, y: -8 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {/* Outer glow */}
                                                <div
                                                    className="absolute -inset-2 rounded-full blur-lg opacity-40"
                                                    style={{ backgroundColor: theme.colors.accent }}
                                                />
                                                {/* Flame body */}
                                                <motion.div
                                                    className="w-3 h-5 rounded-full relative"
                                                    style={{
                                                        background: `radial-gradient(ellipse at center bottom, #FFF 0%, ${theme.colors.accent} 40%, ${theme.colors.primary} 90%)`,
                                                    }}
                                                    animate={{
                                                        scaleY: isBlowing ? [0.5, 0.2, 0.4] : [1, 1.2, 0.9, 1],
                                                        scaleX: isBlowing ? [1.4, 0.7, 1.2] : [1, 0.85, 1.1, 1],
                                                        x: isBlowing ? [0, 4, -3, 5] : 0,
                                                    }}
                                                    transition={{
                                                        duration: isBlowing ? 0.2 : 0.6,
                                                        repeat: Infinity,
                                                    }}
                                                />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="smoke"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <motion.div
                                                    className="w-1.5 h-5 rounded-full mx-auto"
                                                    style={{ backgroundColor: '#ccc' }}
                                                    initial={{ y: 0, opacity: 0.5, scaleX: 1 }}
                                                    animate={{ y: -15, opacity: 0, scaleX: 2.5 }}
                                                    transition={{ duration: 1.2 }}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Candle stick with stripes */}
                                <div
                                    className="w-3 h-12 rounded-t-sm rounded-b-sm relative overflow-hidden"
                                    style={{ backgroundColor: theme.colors.accent }}
                                >
                                    {/* Decorative stripes */}
                                    {[...Array(4)].map((_, j) => (
                                        <div
                                            key={j}
                                            className="absolute w-full h-1"
                                            style={{
                                                backgroundColor: `${theme.colors.primary}40`,
                                                top: `${(j + 1) * 22}%`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cake body */}
                    <div className="flex flex-col items-center -mt-1">
                        {/* Top tier — frosting + decorations */}
                        <div className="relative">
                            <div
                                className="w-56 h-6 rounded-t-full"
                                style={{
                                    background: `linear-gradient(180deg, ${theme.colors.accent}ee, ${theme.colors.accent}bb)`,
                                }}
                            />
                            <div
                                className="w-56 h-14 relative overflow-hidden"
                                style={{
                                    background: `linear-gradient(180deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                                }}
                            >
                                {/* Frosting drips */}
                                <div className="absolute -top-1 left-0 right-0 flex justify-around px-2">
                                    {[...Array(9)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-b-full"
                                            style={{
                                                width: 10 + (i % 3) * 3,
                                                height: 8 + (i % 2) * 6,
                                                backgroundColor: theme.colors.accent,
                                                opacity: 0.9,
                                            }}
                                        />
                                    ))}
                                </div>
                                {/* Sprinkles */}
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={`s-${i}`}
                                        className="absolute w-1.5 h-1.5 rounded-full"
                                        style={{
                                            backgroundColor: ['#fff', theme.colors.accent, '#FFB6C1', '#87CEEB'][i % 4],
                                            left: `${15 + i * 14}%`,
                                            top: `${40 + (i % 2) * 20}%`,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Middle tier */}
                        <div className="relative">
                            <div
                                className="w-68 h-5"
                                style={{
                                    width: '17.5rem',
                                    background: `linear-gradient(180deg, ${theme.colors.accent}cc, ${theme.colors.accent}88)`,
                                }}
                            />
                            <div
                                className="h-12"
                                style={{
                                    width: '17.5rem',
                                    background: `linear-gradient(180deg, ${theme.colors.secondary}, ${theme.colors.primary}dd)`,
                                }}
                            >
                                {/* Frosting drips on middle */}
                                <div className="absolute -top-1 left-0 right-0 flex justify-around px-3">
                                    {[...Array(11)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-b-full"
                                            style={{
                                                width: 8 + (i % 2) * 4,
                                                height: 6 + (i % 3) * 4,
                                                backgroundColor: theme.colors.accent,
                                                opacity: 0.85,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom tier */}
                        <div className="relative">
                            <div
                                className="h-5"
                                style={{
                                    width: '21rem',
                                    background: `linear-gradient(180deg, ${theme.colors.accent}bb, ${theme.colors.accent}77)`,
                                }}
                            />
                            <div
                                className="h-14 rounded-b-lg"
                                style={{
                                    width: '21rem',
                                    background: `linear-gradient(180deg, ${theme.colors.primary}cc, ${theme.colors.secondary})`,
                                    boxShadow: `0 10px 40px ${theme.colors.primary}30`,
                                }}
                            >
                                {/* Bottom drips */}
                                <div className="absolute -top-1 left-0 right-0 flex justify-around px-4">
                                    {[...Array(13)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-b-full"
                                            style={{
                                                width: 8 + (i % 3) * 3,
                                                height: 5 + (i % 2) * 5,
                                                backgroundColor: theme.colors.accent,
                                                opacity: 0.8,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Cake plate */}
                        <div
                            className="h-3 rounded-b-full"
                            style={{
                                width: '24rem',
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.6))',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Instruction */}
            {!allBlownOut && (
                <motion.div
                    className="text-center z-10"
                    animate={{
                        opacity: isBlowing ? [0.4, 1, 0.4] : 1,
                    }}
                    transition={{ duration: 0.5, repeat: isBlowing ? Infinity : 0 }}
                >
                    <p className="font-handwriting text-xl" style={{ color: theme.colors.primary }}>
                        {isBlowing ? '💨 Keep holding...' : '👆 Tap & hold to blow!'}
                    </p>
                </motion.div>
            )}

            {/* Birthday message — Permanent Marker font, no quotes */}
            <AnimatePresence>
                {showMessage && (
                    <motion.div
                        className="max-w-lg mx-auto mt-8 z-10"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: 'spring', stiffness: 80 }}
                    >
                        <div
                            className="bg-white/25 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/30"
                            style={{ boxShadow: `0 20px 50px ${theme.colors.primary}15` }}
                        >
                            <p
                                className="font-marker text-2xl md:text-3xl leading-relaxed text-center"
                                style={{ color: theme.colors.text || '#2D1B33' }}
                            >
                                {displayedMessage}
                                {displayedMessage.length < wishData.message.length && (
                                    <span
                                        className="inline-block w-0.5 h-6 ml-1 animate-pulse"
                                        style={{ backgroundColor: theme.colors.primary }}
                                    />
                                )}
                            </p>
                        </div>

                        {/* Floating emojis */}
                        <div className="flex justify-center gap-4 mt-6">
                            {['❤️', '🎂', '✨', '🎉', '💝'].map((emoji, i) => (
                                <motion.span
                                    key={i}
                                    className="text-2xl"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + i * 0.15 }}
                                >
                                    {emoji}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
