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
