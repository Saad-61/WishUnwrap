import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeConfig } from '../../types';

interface MemoryUnlockProps {
    photos: string[];
    theme: ThemeConfig;
    onComplete: () => void;
}

interface Card {
    id: number;
    photoIndex: number;
    photo: string;
}

// Pre-compute sparkle directions
const SPARKLE_DIRS = [...Array(8)].map((_, i) => ({
    x: Math.cos((i * Math.PI * 2) / 8) * 60,
    y: Math.sin((i * Math.PI * 2) / 8) * 60,
}));

// Shuffle array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const MemoryUnlock: React.FC<MemoryUnlockProps> = ({ photos, theme, onComplete }) => {
    // Create pairs: each photo appears twice, shuffled
    const [cards] = React.useState<Card[]>(() => {
        const pairs: Card[] = [];
        photos.forEach((photo, i) => {
            pairs.push({ id: i * 2, photoIndex: i, photo });
            pairs.push({ id: i * 2 + 1, photoIndex: i, photo });
        });
        return shuffle(pairs);
    });

    const [flippedCards, setFlippedCards] = React.useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = React.useState<Set<number>>(new Set());
    const [isChecking, setIsChecking] = React.useState(false);
    const [sparkleCardId, setSparkleCardId] = React.useState<number | null>(null);
    const [allMatched, setAllMatched] = React.useState(false);
    const [moves, setMoves] = React.useState(0);

    // Pre-computed confetti
    const [confettiData] = React.useState(() =>
        [...Array(40)].map(() => ({
            left: `${Math.random() * 100}%`,
            rotation: Math.random() * 720,
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            color: [theme.colors.primary, theme.colors.accent, theme.colors.secondary, '#fff'][Math.floor(Math.random() * 4)],
        }))
    );

    const handleCardClick = (cardId: number) => {
        if (isChecking) return;
        if (flippedCards.includes(cardId)) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || matchedPairs.has(card.photoIndex)) return;

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setIsChecking(true);

            const card1 = cards.find(c => c.id === newFlipped[0])!;
            const card2 = cards.find(c => c.id === newFlipped[1])!;

            if (card1.photoIndex === card2.photoIndex) {
                // Match found!
                setTimeout(() => {
                    const newMatched = new Set(matchedPairs);
                    newMatched.add(card1.photoIndex);
                    setMatchedPairs(newMatched);
                    setFlippedCards([]);
                    setIsChecking(false);
                    setSparkleCardId(cardId);
                    setTimeout(() => setSparkleCardId(null), 800);

                    // Check if all matched
                    if (newMatched.size === photos.length) {
                        setTimeout(() => {
                            setAllMatched(true);
                            setTimeout(onComplete, 2500);
                        }, 500);
                    }
                }, 600);
            } else {
                // No match — flip back
                setTimeout(() => {
                    setFlippedCards([]);
                    setIsChecking(false);
                }, 1000);
            }
        }
    };

    const isCardVisible = (card: Card) => {
        return flippedCards.includes(card.id) || matchedPairs.has(card.photoIndex);
    };

    // Grid layout
    const getGridClass = () => {
        const total = cards.length;
        if (total <= 4) return 'grid-cols-2 max-w-sm';
        if (total <= 6) return 'grid-cols-3 max-w-lg';
        if (total <= 8) return 'grid-cols-4 max-w-2xl';
        return 'grid-cols-4 max-w-2xl';
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, ${theme.colors.bg}, ${theme.colors.primary}12)` }}
        >
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <p
                    className="text-base tracking-[0.25em] uppercase mb-2 font-display"
                    style={{ color: theme.colors.secondary }}
                >
                    Find the matching pairs
                </p>
                <h2
                    className="text-4xl md:text-5xl font-handwriting mb-2"
                    style={{ color: theme.colors.primary }}
                >
                    Memory Match
                </h2>
                <div className="flex items-center justify-center gap-6 text-sm" style={{ color: theme.colors.text || '#555' }}>
                    <span className="font-handwriting-alt text-lg">
                        {matchedPairs.size} / {photos.length} pairs found
                    </span>
                    <span className="font-handwriting-alt text-lg opacity-60">
                        {moves} moves
                    </span>
                </div>
            </motion.div>

            {/* Cards grid */}
            <div className={`grid ${getGridClass()} gap-3 mx-auto w-full px-4`}>
                {cards.map((card, index) => {
                    const visible = isCardVisible(card);
                    const matched = matchedPairs.has(card.photoIndex);
                    const isSparkle = sparkleCardId === card.id;

                    return (
                        <motion.div
                            key={card.id}
                            className="relative cursor-pointer aspect-square"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: 1,
                                scale: matched ? 0.95 : 1,
                            }}
                            transition={{ delay: index * 0.05, type: 'spring', stiffness: 120 }}
                            onClick={() => handleCardClick(card.id)}
                            whileHover={!visible ? { scale: 1.05 } : {}}
                            whileTap={!visible ? { scale: 0.95 } : {}}
                        >
                            <div className="relative w-full h-full" style={{ perspective: '800px' }}>
                                {/* Photo face */}
                                <motion.div
                                    className="absolute inset-0 rounded-xl overflow-hidden"
                                    animate={{ rotateY: visible ? 0 : 180 }}
                                    transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 15 }}
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <img
                                        src={card.photo}
                                        alt={`Memory ${card.photoIndex + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div
                                        className="absolute inset-0 rounded-xl"
                                        style={{
                                            border: matched
                                                ? `3px solid ${theme.colors.accent}`
                                                : '3px solid rgba(255,255,255,0.8)',
                                            boxShadow: matched
                                                ? `0 0 20px ${theme.colors.accent}50`
                                                : '0 4px 15px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    {matched && (
                                        <div className="absolute top-2 right-2 text-xl">✅</div>
                                    )}
                                </motion.div>

                                {/* Card back */}
                                <motion.div
                                    className="absolute inset-0 rounded-xl flex flex-col items-center justify-center"
                                    animate={{ rotateY: visible ? -180 : 0 }}
                                    transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 15 }}
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                                        boxShadow: `0 6px 25px ${theme.colors.primary}30`,
                                    }}
                                >
                                    <motion.span
                                        className="text-4xl"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        🎁
                                    </motion.span>
                                    <span className="text-white/70 text-xs font-handwriting-alt text-base mt-1">
                                        Tap!
                                    </span>
                                </motion.div>
                            </div>

                            {/* Match sparkle */}
                            <AnimatePresence>
                                {isSparkle && SPARKLE_DIRS.map((dir, i) => (
                                    <motion.div
                                        key={`sp-${i}`}
                                        className="absolute rounded-full pointer-events-none"
                                        style={{
                                            width: 6,
                                            height: 6,
                                            backgroundColor: theme.colors.accent,
                                            left: '50%',
                                            top: '50%',
                                        }}
                                        initial={{ x: 0, y: 0, opacity: 1 }}
                                        animate={{ x: dir.x, y: dir.y, opacity: 0, scale: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress dots */}
            <motion.div
                className="mt-6 flex gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {photos.map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full transition-colors"
                        animate={{
                            backgroundColor: matchedPairs.has(i) ? theme.colors.accent : theme.colors.primary + '25',
                            scale: matchedPairs.has(i) ? [1, 1.4, 1] : 1,
                        }}
                    />
                ))}
            </motion.div>

            {/* All matched celebration */}
            <AnimatePresence>
                {allMatched && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {confettiData.map((piece, i) => (
                            <motion.div
                                key={`c-${i}`}
                                className="absolute w-3 h-3 rounded-sm"
                                style={{ backgroundColor: piece.color, left: piece.left }}
                                initial={{ y: -50, rotate: 0, opacity: 1 }}
                                animate={{ y: window.innerHeight + 50, rotate: piece.rotation, opacity: 0 }}
                                transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeIn' }}
                            />
                        ))}

                        <motion.div
                            className="bg-white/95 backdrop-blur-md rounded-3xl px-10 py-8 shadow-2xl text-center"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                            <p className="text-5xl mb-3">🎉</p>
                            <h3 className="text-3xl font-handwriting mb-2" style={{ color: theme.colors.primary }}>
                                All Memories Found!
                            </h3>
                            <p className="font-handwriting-alt text-lg opacity-60" style={{ color: theme.colors.text || '#333' }}>
                                You did it in {moves} moves!
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
