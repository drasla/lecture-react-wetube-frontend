import { api } from "./axios.ts";

export type Notice = {
    id: number;
    createdAt: string;
    updatedAt: string;
    title: string;
    content: string;
    viewCount: number;
};

export type NoticeListResponse = {
    notices: Notice[];
    total: number;
    page: number;
    totalPages: number;
};

// 공지사항 목록을 출력해주기 위해서는
// 사용자가 보고 있는 페이지 수와 한 페이지에 출력하는 게시글 수를 같이 적어서 전달해야 하는데
// 방식이 GET임. GET은 주소에 파라메터를 적어줘야 함. => queryString
export const fetchNotices = async (page = 1, limit = 10) => {
    const response = await api.get<NoticeListResponse>(`/notices?page=${page}&limit=${limit}`);
    return response.data;
};

// 공지사항 상세 조회 API
export const fetchNotice = async (noticeId: number) => {
    const response = await api.get<Notice>(`/notices/${noticeId}`);
    return response.data;
}

// 공지사항 삭제 API
export const deleteNotice = async (noticeId: number) => {
    const response = await api.delete(`/notices/${noticeId}`);
    return response.data;
}

// 공지사항 등록 API
export const createNotice = async (title: string, content: string) => {
    const response = await api.post<Notice>("/notices", { title, content });
    return response.data;
}

// 공지사항 수정 API
export const updateNotice = async (noticeId: number, data: { title: string; content: string}) => {
    const response = await api.patch<Notice>(`/notices/${noticeId}`, data);
    return response.data;
}
