import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
    deleteInquiry,
    deleteInquiryAnswer,
    fetchInquiryDetail,
    type Inquiry,
} from "../../api/inquiry.ts";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { twMerge } from "tailwind-merge";
import Button from "../../components/ui/Button.tsx";
import dayjs from "dayjs";
import { MdDelete, MdEdit } from "react-icons/md";

function InquiryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInquiry(Number(id)).then(() => {});
    }, []);

    const loadInquiry = async (inquiryId: number) => {
        try {
            const result = await fetchInquiryDetail(inquiryId);
            setInquiry(result);
        } catch (e) {
            console.log(e);
            alert("문의 내용을 불러오지 못했습니다.");
            navigate("/inquiries");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInquiry = async () => {
        if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;
        try {
            await deleteInquiry(Number(id));
            alert("삭제되었습니다.");
            navigate("/inquiries");
        } catch (e) {
            console.log(e);
            alert("삭제에 실패했습니다.");
        }
    };

    const handleDeleteAnswer = async () => {
        if (!window.confirm("정말 이 답변을 삭제하시겠습니까?")) return;
        try {
            await deleteInquiryAnswer(Number(id));
            // 화면 새로고침 없이 데이터만 갱신
            loadInquiry(Number(id)).then(() => {});
        } catch (e) {
            console.log(e);
            alert("삭제에 실패했습니다.");
        }
    };

    if (loading) return <div className={twMerge(["p-10", "text-center"])}>로딩 중...</div>;
    if (!inquiry) return null;

    // 권한 체크
    const isAuthor = user?.id === inquiry.author.id;
    const isAdmin = user?.role === "ADMIN";

    return (
        <div className={twMerge(["max-w-4xl", "mx-auto", "px-4"])}>
            {/* 전체 헤더 */}
            <div className={twMerge(["flex", "justify-between", "items-center", "mb-6"])}>
                <h1 className={twMerge(["text-2xl", "font-bold"])}>문의 내용</h1>
                <Button variant={"secondary"} onClick={() => navigate("/inquiries")}>
                    목록으로
                </Button>
            </div>

            {/* 문의 본문 영역 */}
            <div className={twMerge(["border", "border-divider", "rounded-lg", "p-6", "mb-6"])}>
                <div className={twMerge(["border-b", "border-divider", "pb-4", "mb-4"])}>
                    <div className={twMerge(["flex", "items-center", "gap-2", "mb-2"])}>
                        <span
                            className={twMerge(
                                ["px-2", "py-1", "text-xs", "rounded-full", "whitespace-nowrap"],
                                inquiry.isAnswered
                                    ? ["bg-success-main/10", "text-success-main"]
                                    : ["bg-text-disabled/30", "text-text-disabled"],
                            )}>
                            {inquiry.isAnswered ? "답변완료" : "답변대기"}
                        </span>
                        <span className={twMerge(["text-sm", "text-text-disabled"])}>
                            {dayjs(inquiry.createdAt).format("YYYY.MM.DD HH:mm")}
                        </span>
                    </div>
                    <h2 className={twMerge(["text-xl", "font-bold"])}>{inquiry.title}</h2>
                </div>
                <div className={twMerge(["min-h-40", "whitespace-pre-wrap"])}>
                    {inquiry.content}
                </div>
                {(isAuthor || isAdmin) && (
                    <div
                        className={twMerge(
                            ["flex", "justify-end", "gap-2"],
                            ["mt-6", "pt-4", "border-t", "border-divider"],
                        )}>
                        {isAuthor && (
                            <Button
                                variant={"ghost"}
                                onClick={() => navigate(`/inquiries/${inquiry.id}/edit`)}>
                                <MdEdit /> 수정
                            </Button>
                        )}
                        <Button variant={"error"} onClick={handleDeleteInquiry}>
                            <MdDelete /> 삭제
                        </Button>
                    </div>
                )}
            </div>

            {/* 답변 영역 */}
            {inquiry.isAnswered && inquiry.answer ? (
                // 답변이 있을 때
                <div className={twMerge(["border", "border-divider", "rounded-lg", "p-6"])}>
                    <div className={twMerge(["flex", "justify-between", "items-center", "mb-4"])}>
                        <h3
                            className={twMerge(
                                ["font-bold", "text-primary-main"],
                                ["flex", "items-center", "gap-2"],
                            )}>
                            Admin 답변
                            <span className={twMerge(["text-xs", "text-text-disabled"])}>
                                {dayjs(inquiry.answeredAt).format("YYYY.MM.DD HH:mm")}
                            </span>
                        </h3>
                        {isAdmin && (
                            <Button variant={"error"} size={"sm"} onClick={handleDeleteAnswer}>
                                답변 삭제
                            </Button>
                        )}
                    </div>
                    <div className={twMerge(["whitespace-pre-wrap"])}>
                        {inquiry.answer}
                    </div>
                </div>
            ) : (
                // 답변이 없을 때
                <div
                    className={twMerge(
                        ["p-8", "text-center"],
                        ["border", "border-dashed", "border-divider", "rounded-lg"],
                    )}>
                    아직 답변이 등록되지 않았습니다.
                </div>
            )}
        </div>
    );
}

export default InquiryDetail;
