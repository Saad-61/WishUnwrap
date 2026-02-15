export type Theme = 'vibrant' | 'dreamy' | 'starry' | 'retro';

export interface WishData {
    name: string;
    age: number;
    theme: Theme;
    message: string;
    photos: string[]; // Base64 encoded images
    voiceText?: string; // For text-to-speech
}

export interface ThemeConfig {
    name: string;
    icon: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        bg: string;
    };
    description: string;
}
