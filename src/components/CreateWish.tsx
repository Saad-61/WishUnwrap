import React from 'react';
import { motion } from 'framer-motion';
import { useWishForm } from '../hooks/useWishForm';
import { PhotoUpload } from './PhotoUpload';
import { ThemeSelector } from './ThemeSelector';
import { MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH } from '../constants';
import type { Theme, WishData } from '../types';

interface CreateWishProps {
    onWishCreated: (data: WishData) => void;
}

export const CreateWish: React.FC<CreateWishProps> = ({ onWishCreated }) => {
    const { formData, updateField, isValid } = useWishForm();

    const handleCreate = () => {
        if (!isValid) return;
        onWishCreated(formData);
    };

    const charCount = formData.message.length;
    const isMessageValid = charCount >= MESSAGE_MIN_LENGTH && charCount <= MESSAGE_MAX_LENGTH;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gradient from-vibrant-primary to-vibrant-secondary mb-2">
                        🎂 Create Birthday Magic
                    </h1>
                    <p className="text-gray-600">
                        Make someone's day special with an interactive birthday wish
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            🎉 Birthday Person's Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Enter their name..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-vibrant-primary 
                         focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Age Input */}
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                            🎈 Age (optional)
                        </label>
                        <input
                            id="age"
                            type="number"
                            min="1"
                            max="120"
                            value={formData.age || ''}
                            onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                            placeholder="22"
                            className="w-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-vibrant-primary 
                         focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Theme Selector */}
                    <ThemeSelector
                        selectedTheme={formData.theme}
                        onThemeChange={(theme: Theme) => updateField('theme', theme)}
                    />

                    {/* Photo Upload */}
                    <PhotoUpload
                        photos={formData.photos}
                        onPhotosChange={(photos) => updateField('photos', photos)}
                    />

                    {/* Message Input */}
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            ✍️ Your Birthday Message
                        </label>
                        <textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => updateField('message', e.target.value)}
                            placeholder="Write a heartfelt message..."
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-vibrant-primary 
                         focus:outline-none transition-colors resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <p className={`text-xs ${isMessageValid ? 'text-green-600' : 'text-gray-500'}`}>
                                {charCount < MESSAGE_MIN_LENGTH
                                    ? `Minimum ${MESSAGE_MIN_LENGTH} characters (${MESSAGE_MIN_LENGTH - charCount} more needed)`
                                    : `${charCount} / ${MESSAGE_MAX_LENGTH} characters`
                                }
                            </p>
                            {charCount > MESSAGE_MAX_LENGTH && (
                                <p className="text-xs text-red-600">
                                    {charCount - MESSAGE_MAX_LENGTH} characters over limit
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Privacy Notice */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🔒</span>
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">Your data stays private</h3>
                                <p className="text-sm text-blue-700">
                                    Photos are compressed (up to 93% smaller!) and encoded directly in the shareable link.
                                    Nothing is uploaded to our servers. Ever.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Create Button */}
                    <motion.button
                        whileHover={{ scale: isValid ? 1.02 : 1 }}
                        whileTap={{ scale: isValid ? 0.98 : 1 }}
                        onClick={handleCreate}
                        disabled={!isValid}
                        className={`
              w-full py-4 rounded-lg font-semibold text-lg transition-all
              ${isValid
                                ? 'bg-gradient-to-r from-vibrant-primary to-vibrant-secondary text-white hover:shadow-lg'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        {isValid ? '✨ Create Birthday Wish' : '📝 Fill in required fields'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
