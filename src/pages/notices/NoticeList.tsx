import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useEffect, useState } from "react";
import { fetchNotices, type Notice } from "../../api/notice.ts";
import { twMerge } from "tailwind-merge";
import Button from "../../components/ui/Button.tsx";
import dayjs from "dayjs";

function NoticeList() {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotices().then(() => {});
    }, []);

    const loadNotices = async () => {
        try {
            const data = await fetchNotices();
            setNotices(data.notices);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={twMerge(["w-full", "max-w-4xl", "mx-auto", "px-4"])}>
            <div className={twMerge(["flex", "justify-between", "items-center", "mb-6"])}>
                <h1 className={twMerge(["text-2xl", "font-bold"])}>공지사항</h1>
                {user?.role === "ADMIN" && (
                    <Button onClick={() => navigate("/notices/create")}>글쓰기</Button>
                )}
            </div>
            <div
                className={twMerge([
                    "bg-background-paper",
                    "border",
                    "border-divider",
                    "rounded-lg",
                ])}>
                {/* 게시글 목록 헤더 */}
                <div
                    className={twMerge(
                        ["flex", "gap-4", "px-6", "py-3"],
                        ["border-b", "border-divider"],
                        ["text-sm", "font-medium", "text-text-disabled"],
                    )}>
                    <div className={twMerge(["w-1/12", "text-center"])}>번호</div>
                    <div className={twMerge(["flex-1", "text-center"])}>제목</div>
                    <div className={twMerge(["w-1/6", "text-center", "hidden", "md:block"])}>날짜</div>
                    <div className={twMerge(["w-1/12", "text-center", "hidden", "md:block"])}>조회</div>
                </div>

                {/* 게시글 목록 */}
                {loading ? (
                    <div className={twMerge(["p-8", "text-center"])}>로딩 중...</div>
                ) : // 2가지 상황
                // 1. 게시글이 진짜 아예 없을 때
                // 2. 게시글이 있을 때
                notices.length === 0 ? (
                    <div className={twMerge(["p-8", "text-center"])}>
                        등록된 공지사항이 없습니다.
                    </div>
                ) : (
                    notices.map(notice => (
                        <div
                            key={notice.id}
                            className={twMerge(
                                ["flex", "gap-4", "px-6", "py-3"],
                                ["border-b", "border-divider", "last:border-none"],
                                ["text-sm", "font-medium", "text-text-disabled"],
                            )}>
                            <div className={twMerge(["w-1/12", "text-center"])}>{notice.id}</div>
                            <div className={twMerge(["flex-1", "text-center"])}>
                                <Link to={`/notices/${notice.id}`}>{notice.title}</Link>
                            </div>
                            <div className={twMerge(["w-1/6", "text-center", "hidden", "md:block"])}>
                                {/*
                                         dayjs().format() : dayjs 날짜 타입을 정해진 포맷의 string으로 반환
                                         YYYY : 년도, YY : 년도의 뒤 두자리
                                         MM : 월
                                         DD : 일
                                         hh : 시, HH : 24시간제
                                         mm : 분
                                         ss : 초
                                     */}
                                {dayjs(notice.createdAt).format("YYYY.MM.DD")}
                            </div>
                            <div className={twMerge(["w-1/12", "text-center", "hidden", "md:block"])}>
                                {notice.viewCount}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NoticeList;
