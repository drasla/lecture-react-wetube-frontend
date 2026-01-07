import { twMerge } from "tailwind-merge";
import { useLayoutStore } from "../../store/useLayoutStore.ts";
import { Link, useLocation } from "react-router";
import { MdAccountBox, MdHistory, MdHome, MdSubscriptions, MdThumbUp } from "react-icons/md";
import type { IconType } from "react-icons";
import { useAuthStore } from "../../store/useAuthStore.ts";
import Backdrop from "../ui/Backdrop.tsx";

type MenuItemType = {
    icon: IconType;
    text: string;
    path: string;
};

function Sidebar() {
    const { pathname } = useLocation();

    const { isSidebarOpen, closeSidebar } = useLayoutStore();
    const { user, isLoggedIn } = useAuthStore();

    const menuItems: MenuItemType[] = [
        { icon: MdHome, text: "홈", path: "/" },
        { icon: MdSubscriptions, text: "구독", path: "/channels/subscriptions" },
        { icon: MdHistory, text: "시청 기록", path: "/videos/history" },
    ];

    const userMenuItems: MenuItemType[] = [
        { icon: MdThumbUp, text: "좋아요 표시한 동영상", path: "/playlist/liked" },
        { icon: MdAccountBox, text: "내 채널", path: user ? `/channels/${user.id}` : "/sign-in" },
    ];

    const handleMenuClick = () => {
        // window.innerWidth : 사용자가 지금 보고 있는 화면의 가로 크기 px
        if (window.innerWidth < 640) {
            closeSidebar();
        }
    };

    return (
        <>
            {isSidebarOpen && (
                <div className={twMerge(["sm:hidden"])}>
                    <Backdrop onClose={closeSidebar} className={twMerge(["z-30"])} />
                </div>
            )}

            <aside
                className={twMerge(
                    ["fixed", "left-0", "top-14", "bottom-0", "z-40", "w-60"],
                    ["bg-background-paper", "border-r", "border-divider"],
                    // overflow-y-auto 클래스 : 해당 영역을 넘어가는 것을 허용하고, 넘어가면 스크롤바를 만들겠다.
                    ["overflow-y-auto", "transition-all", "duration-200"],

                    // 데스크톱 동작 클래스
                    isSidebarOpen ? ["sm:w-60"] : ["sm:w-18"],

                    // 모바일 동작 클래스
                    isSidebarOpen ? ["translate-x-0"] : ["-translate-x-full"],
                    "sm:translate-x-0",
                )}>
                <div className={twMerge(["flex", "flex-col", "p-3", "gap-1"])}>
                    {menuItems.map(item => (
                        <MenuItem
                            key={item.text}
                            item={item}
                            isOpen={isSidebarOpen}
                            onClose={handleMenuClick}
                            isActive={pathname === item.path}
                        />
                    ))}
                    <div className={twMerge(["my-2", "border-t", "border-divider"])} />
                    {userMenuItems.map(item => (
                        <MenuItem
                            key={item.text}
                            item={item}
                            isOpen={isSidebarOpen}
                            onClose={handleMenuClick}
                            isActive={pathname === item.path}
                        />
                    ))}

                    {!isLoggedIn && isSidebarOpen && (
                        <div
                            className={twMerge([
                                "p-4",
                                "text-sm",
                                "flex",
                                "flex-col",
                                "items-center",
                            ])}>
                            <p className={twMerge(["mb-3", "text-center"])}>
                                로그인하면 동영상에 좋아요를 표시하고 댓글을 달거나 구독할 수
                                있습니다.
                            </p>
                            <Link
                                to={"/sign-in"}
                                onClick={handleMenuClick}
                                className={twMerge(
                                    ["px-4", "py-1.5", "text-secondary-main"],
                                    ["border", "border-secondary-main"],
                                )}>
                                로그인
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;

type MenuItemProps = {
    item: MenuItemType;
    isOpen: boolean;
    isActive: boolean;
    onClose: VoidFunction;
};

function MenuItem({ item, isOpen, isActive, onClose }: MenuItemProps) {
    return (
        <Link
            onClick={onClose}
            to={item.path}
            className={twMerge(
                ["flex", "items-center", "gap-5", "px-3", "py-2.5"],
                ["rounded-lg", "transition-colors"],
                isActive
                    ? ["bg-text-default/10", "text-text-default", "font-semibold"]
                    : ["text-text-default", "hover:bg-text-default/5"],
            )}>
            <item.icon className={twMerge(["w-6", "h-6"], isActive && "text-primary-main")} />
            <span className={twMerge(["text-sm", "truncate"], !isOpen && "sm:hidden")}>
                {item.text}
            </span>
        </Link>
    );
}
