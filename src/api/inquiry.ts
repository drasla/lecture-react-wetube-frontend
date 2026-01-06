import { api } from "./axios.ts";

export interface Inquiry {
    id: number;
    title: string;
    content: string;
    answer?: string;
    isAnswered: boolean;
    answeredAt?: string;
    createdAt: string;
    author: {
        id: number;
        nickname: string;
        email: string;
        profileImage?: string;
    };
}

interface InquiryListResponse {
    inquiries: Inquiry[];
    total: number;
    page: number;
    totalPages: number;
}

// 1:1 내 문의 목록 조회 API
// GET 방식은 queryString 으로 주소에 파라메터를 붙여서 전달해도 되지만,
// api.get(주소, 옵션) 옵션 자리에 { params: { page, limit } } 를 넣어도 자동으로 쿼리 스트링을 붙여줌
export const fetchMyInquiries = async (page = 1, limit = 10) => {
    const response = await api.get<InquiryListResponse>(`/inquiries`, {
        params: { page, limit },
    });
    return response.data;
};

// 1:1 문의 등록 API
export const createInquiry = async (title: string, content: string) => {
    const response = await api.post<Inquiry>("/inquiries", { title, content });
    return response.data;
};

// 1:1 문의 상세 조회 API
export const fetchInquiryDetail = async (inquiryId: number) => {
    const response = await api.get<Inquiry>(`/inquiries/${inquiryId}`);
    return response.data;
}

// 1:1 문의 삭제 API
export const deleteInquiry = async (inquiryId: number) => {
    const response = await api.delete(`/inquiries/${inquiryId}`);
    return response.data;
}

// 1:1 문의 답변 삭제 API
export const deleteInquiryAnswer = async (inquiryId: number) => {
    const response = await api.delete(`/inquiries/${inquiryId}/answer`);
    return response.data;
}

// 1:1 문의 수정 API
export const updateInquiry = async (inquiryId: number, data: { title: string; content: string}) => {
    const response = await api.patch<Inquiry>(`/inquiries/${inquiryId}`, data);
    return response.data;
}