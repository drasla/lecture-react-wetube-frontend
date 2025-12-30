import { twMerge } from "tailwind-merge";
import { FaYoutube } from "react-icons/fa";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import { useAuthStore } from "../../store/useAuthStore.ts";
import { api } from "../../api/axios.ts";

type SignInFormData = {
    username: string;
    password: string;
};

function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>();

    const onSubmit = async (data: SignInFormData) => {
        try {
            const response = await api.post("/auth/login", data);
            const { token, user } = response.data;
            login(token, user);

            alert(`${user.nickname}님 환영합니다!`);
            navigate("/");
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            const msg = axiosError.response?.data.message || "로그인에 실패 되었습니다.";
            setError("root", { message: msg });
        }
    };

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
                    <h1 className={twMerge(["text-2xl", "font-bold"])}>로그인</h1>
                    <p className={twMerge(["text-sm", "text-text-disabled"])}>
                        WeTube 계정으로 이동
                    </p>
                </div>

                <form className={"space-y-6"} onSubmit={handleSubmit(onSubmit)}>
                    <div className={"space-y-4"}>
                        <Input
                            label={"아이디"}
                            placeholder={"아이디를 입력해주세요"}
                            registration={register("username", {
                                required: "아이디는 필수입니다.",
                                minLength: { value: 4, message: "4자 이상 입력해주세요." },
                            })}
                            error={errors.username?.message}
                        />
                        <Input
                            type={"password"}
                            label={"비밀번호"}
                            placeholder={"8자 이상 입력"}
                            registration={register("password", {
                                required: "비밀번호는 필수입니다.",
                                minLength: { value: 8, message: "8자 이상이어야 합니다." },
                            })}
                            error={errors.password?.message}
                        />
                    </div>

                    {errors.root && (
                        <div
                            className={twMerge(
                                ["p-3", "bg-error-main/10", "border", "border-error-main/20"],
                                ["rounded", "text-error-main", "text-sm", "text-center"],
                            )}>
                            {errors.root.message}
                        </div>
                    )}

                    <Button size={"lg"} className={"w-full"} disabled={isSubmitting}>
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </Button>

                    <p className={twMerge(["text-center", "text-sm", "text-text-disabled"])}>
                        회원이 아니신가요?{" "}
                        <Link
                            to={"/sign-up"}
                            className={twMerge(["text-secondary-main", "hover:underline"])}>
                            계정 만들기
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignIn;
