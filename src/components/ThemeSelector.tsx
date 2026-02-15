import React from 'react';
import { motion } from 'framer-motion';
import { THEMES } from '../constants';
import type { Theme } from '../types';

interface ThemeSelectorProps {
    selectedTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ selectedTheme, onThemeChange }) => {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
                🎨 Choose Theme
            </label>

            <div className="grid grid-cols-2 gap-3">
                {Object.entries(THEMES).map(([key, theme]) => {
                    const isSelected = selectedTheme === key;

                    return (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onThemeChange(key as Theme)}
                            className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${isSelected
                                    ? 'border-vibrant-primary bg-vibrant-primary bg-opacity-10'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
              `}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">{theme.icon}</span>
                                <span className="font-semibold text-sm">{theme.name}</span>
                            </div>

                            {/* Color Preview */}
                            <div className="flex gap-1 mb-2">
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.primary }} />
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.secondary }} />
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.accent }} />
                            </div>

                            <p className="text-xs text-gray-500">{theme.description}</p>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
