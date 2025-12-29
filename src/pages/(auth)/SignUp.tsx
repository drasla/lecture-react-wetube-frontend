import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { FaYoutube } from "react-icons/fa";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";

type SignUpFormData = {
    username: string;
    email: string;
    password: string;
    nickName: string;
    birthDate: string;
    phoneNumber: string;
    gender: "MALE" | "FEMALE";
    zipCode: string;
    address1: string;
    address2?: string;
};

function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>();

    return (
        <div
            className={twMerge(
                ["min-h-[calc(100dvh-var(--height-header))]"],
                ["flex", "justify-center", "items-center"],
            )}>
            <div
                className={twMerge(
                    ["w-full", "max-w-[500px]", "space-y-8", "p-8"],
                    ["border", "border-divider", "rounded-xl", "shadow-lg", "bg-background-paper"],
                )}>
                {/* 로고 영역 */}
                <div className={twMerge(["flex", "flex-col", "items-center", "gap-2"])}>
                    <FaYoutube className={twMerge(["w-12", "h-12", "text-primary-main"])} />
                    <h1 className={twMerge(["text-2xl", "font-bold"])}>회원가입</h1>
                    <p className={twMerge(["text-sm", "text-text-disabled"])}>
                        WeTube와 함께하세요
                    </p>
                </div>

                <form className={"space-y-6"}>
                    <div className={"space-y-4"}>
                        <h3
                            className={twMerge(
                                ["pb-2"],
                                ["text-lg", "font-semibold"],
                                ["border-b", "border-divider"],
                            )}>
                            계정 정보
                        </h3>
                        <div className={twMerge(["flex", "gap-2"])}>
                            <Input
                                label={"아이디"}
                                placeholder={"아이디를 입력해주세요"}
                                {...register("username", {
                                    required: "아이디는 필수입니다.",
                                    minLength: { value: 4, message: "4자 이상 입력해주세요." },
                                })}
                                error={errors.username?.message}
                            />
                            <Button
                                type={"button"}
                                variant={"secondary"}
                                className={twMerge(["w-32", "mt-6", "text-sm"])}>
                                중복확인
                            </Button>
                        </div>
                        <Input type={"password"} label={"비밀번호"} placeholder={"8자 이상 입력"}
                               registration={register("password", {
                                   required: "비밀번호는 필수입니다.",
                                   minLength: { value: 8, message: "8자 이상이어야 합니다."}
                               })}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
