export interface Inquiry {
    id: number;
    title: string;
    content: string;
    answer?: string;
    isAnswered: boolean;
    answeredAt?: string;
    createdAt: string;
    author: {
        nickname: string;
        email?: string;
    }
}