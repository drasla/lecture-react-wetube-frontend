import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { useForm } from "react-hook-form";
import { createNotice, fetchNotice, updateNotice } from "../../api/notice.ts";
import { twMerge } from "tailwind-merge";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import { useEffect } from "react";

type NoticeEditFormData = {
    title: string;
    content: string;
};

function NoticeEdit() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<NoticeEditFormData>();

    // edit는 기존 데이터를 불러와서,
    // input 등에 그 데이터를 넣어줘야 함

    useEffect(() => {
        loadNotice(Number(id)).then(() => {})
    }, []);

    const loadNotice = async (noticeId: number) => {
        try {
            const result = await fetchNotice(noticeId);
            setValue("title", result.title);
            setValue("content", result.content);
        } catch (e) {
            console.log(e);
            alert("데이터를 불러오지 못 했습니다.");
            navigate("/notices");
        }
    }

    const onSubmit = async (formData: NoticeEditFormData) => {
        try {
            await updateNotice(Number(id), formData);
            // navigate("/notices");
            navigate(`/notices/${id}`);
        } catch (e) {
            console.log(e);
            alert("등록에 실패했습니다.");
        }
    }

    if (!user || user.role !== "ADMIN") return null;

    return (
        <div className={twMerge(["max-w-4xl", "mx-auto", "px-4"])}>
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-6"])}>공지사항 작성</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["space-y-6", "p-6", "rounded-lg", "border", "border-divider"])}>
                <Input
                    label={"제목"}
                    placeholder={"공지사항 제목을 입력하세요"}
                    error={errors.title?.message}
                    registration={register("title", { required: "제목은 필수입니다." })}
                />
                <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                    <label className={twMerge(["text-sm", "font-medium"])}>내용</label>
                    <textarea
                        className={twMerge(
                            ["h-80", "p-3", "rounded-md", "border", "border-divider"],
                            ["focus:outline-none", "focus:border-secondary-main", "resize-none"],
                        )}
                        placeholder={"공지사항 내용을 입력하세요."}
                        {...register("content", { required: "내용은 필수입니다." })}
                    />
                    {errors.content && (
                        <span className={twMerge(["text-xs", "text-error-main"])}>
                            {errors.content.message}
                        </span>
                    )}
                </div>

                <div
                    className={twMerge(
                        ["flex", "justify-end", "gap-3"],
                        ["pt-4", "border-t", "border-divider"],
                    )}>
                    <Button type={"button"} onClick={() => navigate("/notices")} variant={"ghost"}>
                        취소
                    </Button>
                    <Button type={"submit"} disabled={isSubmitting}>
                        {isSubmitting ? "등록 중.." : "등록하기"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default NoticeEdit;
