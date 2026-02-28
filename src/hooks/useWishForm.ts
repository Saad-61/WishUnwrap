import { useState } from 'react';
import type { WishData, Theme } from '../types';
import { MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH } from '../constants';

interface useWishFormReturn {
    formData: WishData;
    updateField: <K extends keyof WishData>(field: K, value: WishData[K]) => void;
    isValid: boolean;
    errors: Partial<Record<keyof WishData, string>>;
}

export const useWishForm = (): useWishFormReturn => {
    const [formData, setFormData] = useState<WishData>({
        name: '',
        age: 0,
        theme: 'vibrant' as Theme,
        message: '',
        photos: [],
    });

    const [errors, setErrors] = useState<Partial<Record<keyof WishData, string>>>({});

    const updateField = <K extends keyof WishData>(field: K, value: WishData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const isValid =
        formData.name.trim().length >= 2 &&
        formData.message.trim().length >= MESSAGE_MIN_LENGTH &&
        formData.message.trim().length <= MESSAGE_MAX_LENGTH;

    return { formData, updateField, isValid, errors };
};
