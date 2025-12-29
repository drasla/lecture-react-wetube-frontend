import { twMerge } from "tailwind-merge";
import { Outlet } from "react-router";
import Header from "../components/Header.tsx";
import { useThemeStore } from "../store/useThemeStore.ts";
import { useEffect } from "react";

function Layout() {
    const { theme } = useThemeStore();

    // theme라는 값이 변경이 될 때 html 태그에 class="dark"를 추가/제거
    useEffect(() => {
        const html = document.documentElement;
        if (theme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
    }, [theme]);

    return (
        <div className={twMerge("min-h-calc[100dvh-var(--height-header)]", "pt-14")}>
            <Header />
            <main className={"p-4"}>
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
