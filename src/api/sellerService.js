import { productAPI } from './axiosInstance';

export const addProduct = productAPI.create;
export const getSellerProducts = productAPI.getAll;
export const updateSellerProduct = productAPI.update;
export const deleteSellerProduct = productAPI.remove;
export const getCartAnalytics = productAPI.getSellerAnalytics;

