import { cartAPI } from './axiosInstance';

export const addToCart = cartAPI.add;
export const getCart = cartAPI.getByUser;
export const updateCartItem = cartAPI.update;
export const removeCartItem = cartAPI.remove;

