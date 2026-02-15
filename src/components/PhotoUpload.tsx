import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { compressImage, formatBytes, getBase64Size } from '../utils/imageUtils';
import { MAX_PHOTOS, MAX_PHOTO_SIZE } from '../constants';

interface PhotoUploadProps {
    photos: string[];
    onPhotosChange: (photos: string[]) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ photos, onPhotosChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [compressionInfo, setCompressionInfo] = useState<{ original: number; compressed: number } | null>(null);

    const handleFileSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remainingSlots = MAX_PHOTOS - photos.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        setUploading(true);
        const newPhotos: string[] = [];

        for (const file of filesToProcess) {
            if (file.size > MAX_PHOTO_SIZE) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                continue;
            }

            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image.`);
                continue;
            }

            try {
                const originalSize = file.size;
                const compressed = await compressImage(file);
                const compressedSize = getBase64Size(compressed);

                setCompressionInfo({ original: originalSize, compressed: compressedSize });
                newPhotos.push(compressed);
            } catch (error) {
                console.error('Error compressing image:', error);
                alert(`Failed to process ${file.name}`);
            }
        }

        setUploading(false);
        onPhotosChange([...photos, ...newPhotos]);
    };

    const removePhoto = (index: number) => {
        onPhotosChange(photos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    📷 Upload Photos ({photos.length}/{MAX_PHOTOS})
                </label>
                {compressionInfo && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-green-600"
                    >
                        Compressed: {formatBytes(compressionInfo.original)} → {formatBytes(compressionInfo.compressed)}
                    </motion.p>
                )}
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative aspect-square group"
                    >
                        <img
                            src={photo}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full 
                         opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            ×
                        </button>
                    </motion.div>
                ))}

                {/* Upload Button */}
                {photos.length < MAX_PHOTOS && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg 
                       flex flex-col items-center justify-center hover:border-vibrant-primary 
                       transition-colors disabled:opacity-50"
                    >
                        {uploading ? (
                            <div className="animate-spin w-8 h-8 border-4 border-vibrant-primary border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <span className="text-4xl mb-2">+</span>
                                <span className="text-xs text-gray-500">Add Photo</span>
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
            />

            <p className="text-xs text-gray-500">
                🔒 Photos are compressed and encoded in the link - never uploaded to servers
            </p>
        </div>
    );
};
