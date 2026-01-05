import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { deleteNotice, fetchNotice, type Notice } from "../../api/notice.ts";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import Button from "../../components/ui/Button.tsx";

function NoticeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();

    useEffect(() => {
        loadNotice(Number(id)).then(() => {});
    }, []);

    const loadNotice = async (noticeId: number) => {
        try {
            const result = await fetchNotice(noticeId);
            setNotice(result);
        } catch (e) {
            console.log(e);
            alert("공지사항을 불러오지 못했습니다.");
            navigate("/notices");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) return;

        try {
            await deleteNotice(Number(id));
            alert("공지사항이 삭제되었습니다.");
            navigate("/notices");
        } catch (e) {
            console.log(e);
            alert("삭제 권한이 없거나 오류가 발생했습니다.")
        }
    }

    if (loading) return <div>로딩 중...</div>;
    if (!notice) return null;

    return (
        <div className={twMerge(["w-full", "max-w-4xl", "mx-auto", "px-4"])}>
            <div className={twMerge(["border", "border-divider", "rounded-lg", "p-8"])}>
                {/* 제목 헤더 */}
                <div className={twMerge(["border-b", "border-divider", "pb-6", "mb-6"])}>
                    <h1 className={twMerge(["text-2xl", "font-bold", "mb-3"])}>{notice.title}</h1>
                    <div
                        className={twMerge(
                            ["flex", "justify-between", "items-center"],
                            ["text-sm", "text-text-disabled"],
                        )}>
                        <div>작성일: {dayjs(notice.createdAt).format("YYYY년 MM월 DD일")}</div>
                        <div>조회수: {notice.viewCount.toLocaleString()}</div>
                    </div>
                </div>

                {/* 본문 출력 */}
                {/*
                    textarea를 통해서 받은 데이터는 저장될 때 엔터에 대한 사항이 \n 으로 저장됨
                    그걸 화면에서 정상적으로 출력해주기 위해서는 white-space 라고 하는 CSS property를 지정해줘야 함
                */}
                <div className={twMerge(["min-h-50", "whitespace-pre-wrap"])}>{notice.content}</div>

                {/* 버튼 푸터 */}
                <div
                    className={twMerge(
                        ["border-t", "border-divider", "pt-6", "mt-6"],
                        ["flex", "justify-between", "items-center"],
                    )}>
                    <Button variant={"secondary"} onClick={() => navigate("/notices")}>
                        목록으로
                    </Button>

                    {user?.role === "ADMIN" && (
                        <div className={twMerge(["flex", "gap-2"])}>
                            <Button variant={"info"} onClick={() => navigate(`/notices/${notice.id}/edit`)}>수정</Button>
                            <Button variant={"error"} onClick={handleDelete}>삭제</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoticeDetail;
