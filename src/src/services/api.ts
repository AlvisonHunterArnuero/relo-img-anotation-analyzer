import { Image, Category, AnnotationRequest } from '@/types/annotation';

const API_BASE = '/api/proxy';

export const fetchUnanalyzedImages = async (): Promise<Image[]> => {
    const response = await fetch(`${API_BASE}?endpoint=unanalyzed-images`);
    if (!response.ok) {
        throw new Error('Failed to fetch images');
    }
    return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE}?endpoint=categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

export const submitAnnotation = async (annotation: AnnotationRequest): Promise<void> => {
    const response = await fetch(`${API_BASE}?endpoint=annotations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(annotation),
    });

    if (!response.ok) {
        throw new Error('Failed to submit annotation');
    }
};