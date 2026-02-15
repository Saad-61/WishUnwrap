import LZString from 'lz-string';
import type { WishData } from '../types';

/**
 * Encodes wish data into a compressed URL-safe string
 */
export const encodeWishData = (data: WishData): string => {
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);
    return compressed;
};

/**
 * Decodes a compressed URL string back into wish data
 */
export const decodeWishData = (encoded: string): WishData | null => {
    try {
        const json = LZString.decompressFromEncodedURIComponent(encoded);
        if (!json) return null;
        const data = JSON.parse(json) as WishData;
        // Basic validation
        if (!data.name || !data.message || !data.theme) return null;
        return data;
    } catch {
        return null;
    }
};

/**
 * Generates the full shareable URL
 */
export const generateShareUrl = (data: WishData): string => {
    const encoded = encodeWishData(data);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#w=${encoded}`;
};

/**
 * Extracts wish data from the current URL hash
 */
export const getWishFromUrl = (): WishData | null => {
    const hash = window.location.hash;
    if (!hash.startsWith('#w=')) return null;
    const encoded = hash.slice(3);
    return decodeWishData(encoded);
};

/**
 * Estimates the size of the encoded URL in characters
 */
export const estimateUrlSize = (data: WishData): number => {
    const encoded = encodeWishData(data);
    return encoded.length + 3; // +3 for "#w="
};
