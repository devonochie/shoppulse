import { Product, ProductFilters } from "@/types/product.type";
import axiosInstance from "../axios";


const createProduct = async (productData: Product[]): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/products', productData);
    return response.data;
}

const getProducts = async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/products', { params: filters });
    return response.data;
}

const getProductById = async (id: string): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
}
const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await axiosInstance.patch<Product>(`/products/${id}`, productData);
    return response.data;
}

const deleteProduct = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
}

const SearchProduct = async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/products/search', { params: { query } });
    return response.data;
}

export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    SearchProduct
};