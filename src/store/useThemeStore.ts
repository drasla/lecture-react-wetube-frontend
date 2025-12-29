import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
    theme: "light" | "dark";
    toggleTheme: VoidFunction; // 매개변수 없이, toggle만 업데이트하는 함수
}

export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            theme: "light",
            // toggleTheme를 실행하면, 이 zustand가 관리하는 값을 변경할건데
            // 지금 현재 값(state) 중 theme의 값이 light라면, dark로. light가 아니라면 light로 변경
            toggleTheme: () =>
                set(state => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),
        }),
        { name: "wetube-theme" },
    ),
);
