
export interface SalesDataRequest {
    period?: "7d" | "30d";
    currency?: "USD" | "EUR" | "GBP";
}

export interface ProductDataRequest {
    date?: string; 
}

export interface HistoricalDataRequest {
    period?: "30d" | "90d";
    type?: "daily" | "weekly" | "monthly";
}


export interface SalesDataResponse {
    totalSales: number;
    avgOrderValue: number;
    count: number;
    statusDistribution: {
        pending: number;
        completed: number;
        cancelled: number;
    };
}

export interface ProductPerformanceResponse {
    topProduct: Array<{
        name: string;
        totalSold: number;
        totalRevenue: number;
    }>;
    analyticsData: unknown;
}

export interface HistoricalDataResponse {
    _id: string;
    type: string;
    date: string;
    data: Record<string, unknown>;
}

export interface DashboardDataResponse {
    summary: {
        totalOrders: number;
        pendingOrders: number;
        completedPayments: number;
        newUsers: number;
    };
    recentOrders: unknown[];
    newUsers: unknown[];
}

export interface OrderDetailsResponse {
    order: unknown;
    payment: unknown;
    shipping: unknown;
}