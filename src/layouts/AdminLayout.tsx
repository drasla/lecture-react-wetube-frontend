import { useAuthStore } from "../store/useAuthStore.ts";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { MdDashboard, MdHome, MdLogout, MdPeople, MdVideoLibrary } from "react-icons/md";
import Avatar from "../components/ui/Avatar.tsx";

function AdminLayout() {
    const { user, isLoggedIn, logout } = useAuthStore();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (!isLoggedIn || user?.role !== "ADMIN") {
            alert("관리자 권한이 필요합니다.");
            navigate("/");
        }
    }, []);

    const menuItems = [
        { icon: MdDashboard, text: "대시보드", path: "/admin" },
        { icon: MdPeople, text: "회원 관리", path: "/admin/users" },
        { icon: MdVideoLibrary, text: "영상 관리", path: "/admin/videos" },
    ];

    const handleLogout = () => {
        logout();
        navigate("/sign-in");
    };

    if (!user || user.role !== "ADMIN") return null;

    return (
        <div className={twMerge(["flex", "min-h-screen", "bg-gray-100"])}>
            <aside
                className={twMerge(
                    ["w-64", "bg-slate-900", "text-slate-300"],
                    ["flex", "flex-col", "shadow-xl", "z-50"],
                )}>
                <div
                    className={twMerge(
                        ["h-16", "flex", "items-center", "px-6", "font-bold"],
                        ["text-white", "border-b", "border-slate-800"],
                    )}>
                    Wetube Admin
                </div>
                <nav className={twMerge(["flex-1", "py-6", "px-3", "space-y-1"])}>
                    {menuItems.map(item => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.text}
                                to={item.path}
                                className={twMerge(
                                    ["flex", "items-center", "gap-3"],
                                    ["px-4", "py-3", "rounded-lg", "text-sm"],
                                    isActive
                                        ? ["bg-blue-600", "text-white"]
                                        : ["hover:bg-slate-800", "hover:text-white"],
                                )}>
                                <item.icon className={twMerge(["w-5", "h-5"])} />
                                {item.text}
                            </Link>
                        );
                    })}
                </nav>
                <div className={twMerge(["p-4", "border-t", "border-slate-800"])}>
                    <Link
                        to={"/"}
                        className={twMerge(["flex", "items-center", "gap-3", "px-4", "py-2"])}>
                        <MdHome className={twMerge(["w-5", "h-5"])} />
                        메인 사이트 이동
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={twMerge(
                            ["flex", "items-center", "gap-3", "px-4", "py-2"],
                            ["text-red-400"],
                        )}>
                        <MdLogout className={twMerge(["w-5", "h-5"])} />
                        로그아웃
                    </button>
                </div>
            </aside>

            <div className={twMerge(["flex-1", "flex", "flex-col"])}>
                <header
                    className={twMerge(
                        ["h-16", "px-8", "bg-white", "border-b", "border-gray-200"],
                        ["flex", "items-center", "justify-between"],
                    )}>
                    <h2 className={twMerge(["text-lg", "font-bold", "text-gray-800"])}>
                        {/* 현재 사용자가 위치해있는 경로와 동일한 menuItems.path 와 같으면 menuItems.name 출력 */}
                        {menuItems.find(item => item.path === pathname)?.text || "관리자화면"}
                    </h2>

                    <div className={twMerge(["flex", "items-center", "gap-3"])}>
                        <div className={twMerge(["text-right"])}>
                            <p className={twMerge(["text-sm", "font-bold", "text-gray-800"])}>
                                {user.nickname}
                            </p>
                            <p className={twMerge(["text-xs", "text-gray-500"])}>Super Admin</p>
                        </div>
                        <Avatar nickname={user.nickname} src={user.profileImage} size={"sm"} />
                    </div>
                </header>
                <main className={twMerge(["flex-1", "p-8"])}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
