import {api} from "./axios.ts";

export interface DashboardData {
    stats: {
        totalUsers: number;
        totalVideos: number;
        totalViews: number;
        pendingInquiries: number;
    };
    recentUsers: {
        id: number;
        email: string;
        nickname: string;
        profileImage?: string | null;
        createdAt: string;
    }[];
    recentVideos: {
        id: number;
        title: string;
        thumbnailPath: string;
        views: number;
        createdAt: string;
        author: {
            nickname: string;
        }
    }[];
}

export const fetchDashboardStats = async () => {
    const response = await api.get<DashboardData>("/admin/stats");
    return response.data;
}