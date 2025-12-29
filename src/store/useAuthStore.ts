import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
    id: number;
    username: string;
    email: string;
    nickName: string;
    birthDate: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    zipCode: string;
    address1: string;
    address2?: string;
    profileImage?: string;

    role: "USER" | "ADMIN";
};

interface AuthState {
    user: User | null;
    isLoggedIn: boolean;

    // 백엔드와 내용을 주고받을 때, 진짜 값인 id나 username을 주고받으면 보안 상 취약점이
    // 발생되기 때문에 실제 값을 주고받지 않고, 암호화된 token 이라는 값으로 주고 받음
    token: string | null;

    // 로그인 기능
    login: (token: string, user: User) => void;

    // 로그아웃 기능
    logout: () => void;

    // 업데이트 기능
    // Partial 타입 : 일부 필드만 업데이트할 수 있는 타입
    // 실질적으로 Partial 타입은 그 안의 프로퍼티들에 전부 ? 를 붙여줌
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            token: null,
            user: null,
            isLoggedIn: false,

            // login, logout은 기존 값과 상관 없이 새로운 값을 넣어주기만 하면 되기 때문에 set 뒤에 함수가 아님
            login: (token, user) => set({ token: token, user: user, isLoggedIn: true }),
            logout: () => set({ token: null, user: null, isLoggedIn: false }),

            // updateUser는 기존 값을 불러와서 그에 따라 저장하는 내용이 달라져야 되기 때문에 set 뒤가 함수
            // state.user 는 User | null 타입이기 때문에, state.user가 있으면~ 없으면~ 처리
            updateUser: updatedData =>
                set(state => ({ user: state.user ? { ...state.user, ...updatedData } : null })),
        }),
        { name: "wetube-auth" },
    ),
);
