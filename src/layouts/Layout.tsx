import { twMerge } from "tailwind-merge";
import { Outlet } from "react-router";
import Header from "../components/Header.tsx";

function Layout() {
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
