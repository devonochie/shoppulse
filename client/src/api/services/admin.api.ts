
import { DashboardDataResponse, HistoricalDataRequest, HistoricalDataResponse, OrderDetailsResponse, ProductDataRequest, ProductPerformanceResponse, SalesDataRequest, SalesDataResponse } from "@/types/admin.type";
import axiosInstance from "../axios";


export const getSalesData = async (
    salesData: SalesDataRequest
    ): Promise<SalesDataResponse> => {
    try {
        const response = await axiosInstance.post("/analytics/sales", salesData);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Error fetching sales data: ${error.message}`);
        }
        throw error;
    }
};

export const getProductPerformance = async (
    productData?: ProductDataRequest
): Promise<ProductPerformanceResponse> => {
    try {
        const response = await axiosInstance.get("/analytics/products", {
        params: productData,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Error fetching product performance: ${error.message}`);
        }
        throw error;
    }
};

export const getHistoricalData = async (
    historyData?: HistoricalDataRequest
): Promise<HistoricalDataResponse[]> => {
    try {
        const response = await axiosInstance.get("/analytics/history", {
        params: historyData,
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Error fetching historical data: ${error.message}`);
        }
        throw error;
    }
};

export const getDashboardData = async (): Promise<DashboardDataResponse> => {
    try {
        const response = await axiosInstance.get("/admin/dashboard");
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Error fetching dashboard data: ${error.message}`);
        }
        throw error;
    }
};

export const getFullOrderDetails = async (
    orderId: string
): Promise<OrderDetailsResponse> => {
    try {
        const response = await axiosInstance.get(`/admin/orders/${orderId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Error fetching order details: ${error.message}`);
        }
        throw error;
    }
};
