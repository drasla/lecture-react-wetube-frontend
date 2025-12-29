import axios from "axios";

// 백엔드와의 통신을 할 때 기본적으로 갖춰야 하는 형식을 만듦
export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    // 요청(Request)를 보낼 때의 내 신원정보를 담는 header에 기록
    headers: {
        // 내가 지금 뭔가를 보내려고 할 때, 그 body가 json(객체) 형태로 이루어졌음을 표기
        // Content-Type은 정해져 있는 규칙
        "Content-Type": "application/json",

        // x-client-key는 백엔드에서 요청을 한 내용임 (인터넷 상에서 정해진 규칙 X)
        "x-client-key": import.meta.env.VITE_API_KEY,
    }
});

