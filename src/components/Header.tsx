import { type MouseEvent } from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { MdCampaign, MdDarkMode, MdLightMode, MdMenu, MdSearch, MdVideoCall } from "react-icons/md";
import { FaRegUserCircle, FaYoutube } from "react-icons/fa";
import { useThemeStore } from "../store/useThemeStore.ts";
import { useModalStore } from "../store/useModalStore.ts";
import { useAuthStore } from "../store/useAuthStore.ts";

function Header() {
    const { theme, toggleTheme } = useThemeStore();
    const { openModal } = useModalStore();
    const { isLoggedIn } = useAuthStore();

    // MouseEvent 라는 이름의 타입이 Javascript에도 있고 React에도 있음
    // 우리가 써야 하는건, React의 MouseEvent 타입이라 이를 명시적으로 수동으로 적어줘야 함
    const handleUploadClick = (event: MouseEvent<HTMLAnchorElement>) => {
        // 비회원이 누르면, 모달을 띄우고 끝내는 함수
        if (!isLoggedIn) {
            // a 태그에 onClick을 사용하고 있기 때문에 a의 기본 기능인 "이동"을 막을 필요가 있음
            // 이벤트 버블링 : 클릭 이벤트 등의 이벤트가 상위 요소로 전파되는 현상
            event.preventDefault();
            openModal("LOGIN_REQUIRED");
        }
    }

    return (
        <header
            className={twMerge(
                ["fixed", "top-0", "left-0", "right-0", "h-header", "px-4"],
                ["border-b", "border-divider"],
                ["flex", "justify-between", "items-center"],
                ["z-50"],
            )}>
            {/* 1. 왼쪽 */}
            <div className={twMerge(["flex", "items-center", "gap-4"])}>
                <button className={twMerge(["p-2", "rounded-full", "hover:bg-text-default/10"])}>
                    <MdMenu className={twMerge(["w-6", "h-6"])} />
                </button>
                <Link to={"/"} className={twMerge(["flex", "items-center", "gap-2"])}>
                    <FaYoutube className={twMerge(["w-8", "h-8", "text-primary-main"])} />
                    <span className={twMerge(["text-xl", "font-bold"])}>WeTube</span>
                </Link>
            </div>

            {/* 2. 중간 */}
            <div className={twMerge(["flex-1", "max-w-[600px]"], ["flex", "items-center"])}>
                <div className={twMerge(["flex", "w-full"])}>
                    <input
                        placeholder={"검색"}
                        className={twMerge(
                            ["w-full", "px-4", "py-2"],
                            ["text-text-default", "placeholder:text-text-disabled"],
                            ["border", "border-divider", "rounded-l-full", "shadow-inner"],
                            ["focus:outline-none", "focus:border-secondary-main"],
                        )}
                    />
                    <button
                        className={twMerge(
                            ["px-4", "py-2"],
                            ["border", "border-l-0", "rounded-r-full", "border-divider"],
                        )}>
                        <MdSearch className={twMerge(["w-6", "h-6"])} />
                    </button>
                </div>
            </div>

            {/* 3. 오른쪽 */}
            <div className={twMerge(["flex", "items-center", "gap-2"])}>
                <Link
                    to={"/notices"}
                    className={twMerge(
                        ["flex", "items-center", "justify-center", "p-2"],
                        ["rounded-full", "hover:bg-text-default/10"],
                    )}
                    title={"공지사항"}>
                    <MdCampaign className={twMerge(["w-6", "h-6"])} />
                </Link>
                <button
                    onClick={toggleTheme}
                    className={twMerge(
                        ["flex", "items-center", "justify-center", "p-2"],
                        ["rounded-full", "hover:bg-text-default/10"],
                    )}
                    title={theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}>
                    {theme === "dark" ? (
                        <MdLightMode className={twMerge(["w-6", "h-6"])} />
                    ) : (
                        <MdDarkMode className={twMerge(["w-6", "h-6"])} />
                    )}
                </button>
                <Link
                    onClick={handleUploadClick}
                    to={"/upload"}
                    className={twMerge(
                        ["flex", "items-center", "justify-center", "p-2"],
                        ["rounded-full", "hover:bg-text-default/10"],
                    )}
                    title={"동영상 업로드"}>
                    <MdVideoCall className={twMerge(["w-6", "h-6"])} />
                </Link>
                <Link
                    to={"/sign-in"}
                    className={twMerge(
                        ["flex", "items-center", "gap-2", "px-4", "py-2"],
                        ["border", "border-divider", "rounded-full"],
                        ["text-secondary-main", "font-medium", "hover:bg-secondary-main/10"],
                    )}>
                    <FaRegUserCircle className={twMerge(["w-5", "h-5"])} />
                    <span className={twMerge("text-sm")}>로그인</span>
                </Link>
            </div>
        </header>
    );
}

export default Header;
