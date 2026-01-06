import {api} from "./axios.ts";

export interface Video {
    id: number;
    createdAt: string;

    title: string;
    description: string;
    videoPath: string;
    thumbnailPath: string;
    views: number;
    likeCount: number;
    isLiked?: boolean;    // 지금 보고 있는 사용자가 좋아요를 눌렀는가?
    isSubscribed?: boolean; // 지금 보고 있는 사용자가 구독을 했는가?
    subscriberCount?: number; // 지금 영상의 채널장 구독자 수
    author: {                // 영상 업로드한 사람
        id: number;
        nickname: string;
        profileImage?: string;
    }
}

interface VideoListResponse {
    videos: Video[],
    total: number,
    page: number,
    totalPages: number,
    hasNextPage: boolean,
}

export const fetchVideos = async (page = 1, limit = 24) => {
    const response = await api.get<VideoListResponse>(`/videos?page=${page}&limit=${limit}`);
    return response.data;
}

export const fetchVideo = async (videoId: number) => {
    const response = await api.get<Video>(`/videos/${videoId}`);
    return response.data;
}

export const toggleVideoLike = async (videoId: number) => {
    const response = await api.post<{ isLiked: boolean }>(`/videos/${videoId}/like`);
    return response.data;
}



