import type { ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
    vibrant: {
        name: 'Vibrant Party',
        icon: '🌈',
        colors: {
            primary: '#FF6B6B',
            secondary: '#4ECDC4',
            accent: '#FFE66D',
            bg: '#667eea',
        },
        description: 'Bold colors, energetic vibe',
    },
    dreamy: {
        name: 'Soft Dreamy',
        icon: '🌸',
        colors: {
            primary: '#FFB7C5',
            secondary: '#C3B1E1',
            accent: '#F8E9A1',
            bg: '#E8F4F8',
        },
        description: 'Pastels, gentle & calm',
    },
    starry: {
        name: 'Starry Night',
        icon: '🌟',
        colors: {
            primary: '#FFD700',
            secondary: '#4A5568',
            accent: '#F7FAFC',
            bg: '#1A202C',
        },
        description: 'Dark elegance, golden accents',
    },
    retro: {
        name: 'Retro Arcade',
        icon: '🎨',
        colors: {
            primary: '#FF6B9D',
            secondary: '#E8557A',
            accent: '#FFD93D',
            bg: '#FFF0F3',
            text: '#2D1B33',
        },
        description: 'Pixel art, nostalgic vibes',
    },
};

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
export const TARGET_PHOTO_SIZE = 200 * 1024; // 200KB
export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 300;
