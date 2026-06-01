import { productAPI } from './axiosInstance';

export const getAllProducts = productAPI.getAll;
export const getProduct = productAPI.getById;
export const addProduct = productAPI.create;
export const updateProduct = productAPI.update;
export const deleteProduct = productAPI.remove;
export const getSellerAnalytics = productAPI.getSellerAnalytics;

