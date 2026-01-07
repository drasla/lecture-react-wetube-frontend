import { twMerge } from "tailwind-merge";
import { Outlet } from "react-router";
import Header from "../components/layout/Header.tsx";
import { useThemeStore } from "../store/useThemeStore.ts";
import { useEffect } from "react";
import GlobalModal from "../components/ui/GlobalModal.tsx";
import Sidebar from "../components/layout/Sidebar.tsx";
import { useLayoutStore } from "../store/useLayoutStore.ts";

function Layout() {
    const { theme } = useThemeStore();
    const { isSidebarOpen } = useLayoutStore();

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
            <div className={twMerge(["flex"])}>
                <Sidebar />
                <main
                    className={twMerge(
                        ["flex-1", "p-4", "transition-all", "duration-200"],
                        isSidebarOpen ? ["sm:ml-60"] : ["sm:ml-18"],
                    )}>
                    <Outlet />
                </main>
            </div>
            <GlobalModal />
        </div>
    );
}

export default Layout;
