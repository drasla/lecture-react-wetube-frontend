import { api } from "./axios.ts";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    author: {
        id: number;
        nickname: string;
        profileImage: string | null;
    };
}

// 목록을 조회하는 API
export const fetchComments = async (videoId: number) => {
    const response = await api.get<Comment[]>(`/videos/${videoId}/comments`);
    return response.data;
};

// 댓글 등록 요청 API
export const createComment = async (videoId: number, content: string) => {
    const response = await api.post<Comment>(`/videos/${videoId}/comments`, { content });     // { content: content } : key가 변수명과 같아서 줄여서 씀
    return response.data;
};

// 댓글 삭제 요청 API
export const deleteComment = async (commentId: number) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
}