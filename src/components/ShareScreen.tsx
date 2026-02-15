import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WishData } from '../types';
import { generateShareUrl, estimateUrlSize } from '../utils/urlUtils';
import { formatBytes } from '../utils/imageUtils';

interface ShareScreenProps {
    wishData: WishData;
    onBack: () => void;
    onPreview: () => void;
}

export const ShareScreen: React.FC<ShareScreenProps> = ({ wishData, onBack, onPreview }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = generateShareUrl(wishData);
    const urlSize = estimateUrlSize(wishData);
    const isUrlTooLong = urlSize > 2000;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWhatsApp = () => {
        const text = `🎂 I made a special birthday surprise for ${wishData.name}! Check it out: ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handleEmail = () => {
        const subject = `🎂 Birthday Surprise for ${wishData.name}!`;
        const body = `I made a special interactive birthday wish for ${wishData.name}!\n\nClick the link to experience it:\n${shareUrl}`;
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
            >
                {/* Success Header */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-6xl mb-4"
                    >
                        🎉
                    </motion.div>
                    <h1 className="text-3xl font-bold mb-2">
                        Your birthday wish is ready!
                    </h1>
                    <p className="text-gray-600">
                        Share this link with <span className="font-semibold text-vibrant-primary">{wishData.name}</span> to deliver the magic
                    </p>
                </motion.div>

                {/* URL Display */}
                <div className="mb-6">
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 break-all text-sm text-gray-600 font-mono max-h-24 overflow-y-auto">
                        {shareUrl}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                            Link size: {formatBytes(urlSize)}
                            {isUrlTooLong && <span className="text-amber-600 ml-2">⚠️ Link is long, consider fewer photos</span>}
                        </p>
                        <p className="text-xs text-green-600">🔒 No data stored on servers</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-8">
                    {/* Copy Link */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCopy}
                        className="w-full py-3 bg-gradient-to-r from-vibrant-primary to-vibrant-secondary text-white 
                       rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                    >
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.span key="copied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    ✅ Copied to clipboard!
                                </motion.span>
                            ) : (
                                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    📋 Copy Link
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Share via WhatsApp */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleWhatsApp}
                        className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold 
                       flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                    >
                        💬 Share via WhatsApp
                    </motion.button>

                    {/* Share via Email */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEmail}
                        className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold 
                       flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                        ✉️ Share via Email
                    </motion.button>
                </div>

                {/* Preview & Back */}
                <div className="flex gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onBack}
                        className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold 
                       hover:bg-gray-50 transition-colors"
                    >
                        ← Edit Wish
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onPreview}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg 
                       font-semibold hover:shadow-lg transition-shadow"
                    >
                        👀 Preview Experience
                    </motion.button>
                </div>

                {/* Privacy Notice */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-700 text-center">
                        🔒 Everything is encoded in the link. No accounts, no servers, no data collection.
                        Anyone with the link can view the wish.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
