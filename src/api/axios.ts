import axios from "axios";
import { useAuthStore } from "../store/useAuthStore.ts";

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

// axios를 사용하는 가장 큰 이유
// interceptor 를 사용할 수 있음
// interceptor : 요청을 전달하기 전에,
//               전달되는 내용을 가로채서 뭔가 더 적거나 뺄 수 있음

api.interceptors.request.use(config => {
    // 요청(request)를 할 때, interceptor가 편지를 가로채서
    // 회원 정보가 AuthStore에 있으면, 그 token 값을 편지봉투에서
    // Authorization이라고 하는 key의 값을 쓰고
    // 그걸로 교체해서 보내도록 함
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

