export const createOffer = () => Promise.reject(new Error('Offer API is not configured in axiosInstance'));
export const getActiveOffers = () => Promise.resolve({ data: [] });

