import { useNavigate, useParams} from "react-router";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import { fetchInquiryDetail, updateInquiry } from "../../api/inquiry.ts";
import {useEffect} from "react";

type InquiryEditFormData = {
    title: string;
    content: string;
};

function InquiryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<InquiryEditFormData>();

    useEffect(() => {
        loadData().then(() => {});
    }, []);

    const loadData = async () => {
        try {
            const result = await fetchInquiryDetail(Number(id));

            if (result.isAnswered) {
                alert("답변이 달린 글은 수정할 수 없습니다.");
                navigate(-1);
                return;
            }
            setValue("title", result.title);
            setValue("content", result.content);
        } catch (e) {
            console.log(e);
            alert("데이터를 불러오지 못 했습니다.");
            navigate(-1);
        }
    }

    const onSubmit = async (formData: InquiryEditFormData) => {
        try {
            const result = await updateInquiry(Number(id), formData);
            navigate(`/inquiries/${result.id}`);
        } catch (e) {
            console.log(e);
            alert("수정에 실패했습니다.");
        }
    }

    return (
        <div className={twMerge(["max-w-4xl", "mx-auto", "px-4"])}>
            <h1 className={twMerge(["text-2xl", "font-bold", "mb-6"])}>1:1문의 수정</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["space-y-6", "p-6", "rounded-lg", "border", "border-divider"])}>
                <Input
                    label={"제목"}
                    placeholder={"문의 제목을 입력하세요"}
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
                        placeholder={"문의 내용을 입력하세요."}
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
                    <Button type={"button"} onClick={() => navigate("/inquiries")} variant={"ghost"}>
                        취소
                    </Button>
                    <Button type={"submit"} disabled={isSubmitting}>
                        {isSubmitting ? "등록 중.." : "수정하기"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default InquiryEdit;
