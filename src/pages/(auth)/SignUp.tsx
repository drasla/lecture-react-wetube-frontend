import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { FaYoutube } from "react-icons/fa";
import Input from "../../components/ui/Input.tsx";
import Button from "../../components/ui/Button.tsx";
import { Link } from "react-router";
import { api } from "../../api/axios.ts";
import { useState } from "react";

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
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");

    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [nicknameMessage, setNicknameMessage] = useState("");

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        clearErrors,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>();

    const handleCheckUsername = async () => {
        const username = getValues("username");
        if (!username) {
            setError("username", { message: "아이디를 입력해주세요." });
            return;
        }

        try {
            // 백엔드에게 요청을 하고,
            const response = await api.post("/auth/check-username", {
                username: username,
            });
            const { isAvailable, message } = response.data;

            if (isAvailable) {
                // 가능하다라고 답변을 받으면 가능하다는 것을 화면에 출력
                setIsUsernameChecked(true);
                setUsernameMessage("사용 가능한 아이디입니다.");
                clearErrors("username");
            } else {
                // 불가능하다라고 답변을 받으면 불가능하다는 것을 화면에 출력
                setIsUsernameChecked(false);
                setError("username", { message: message });
            }
        } catch (e) {
            console.log(e);
            setError("username", { message: "중복 확인 중 오류가 발생되었습니다." });
        }
    };

    const handleCheckNickname = async () => {
        const nickname = getValues("nickName");
        if (!nickname) {
            setError("nickName", { message: "닉네임을 입력해주세요." });
            return;
        }

        try {
            const response = await api.post("/auth/check-nickname", {
                nickname: nickname,
            });
            const { isAvailable, message } = response.data;

            if (isAvailable) {
                setIsNicknameChecked(true);
                setNicknameMessage(message);
                clearErrors("nickName");
            } else {
                setIsNicknameChecked(false);
                setError("nickName", { message: message });
            }
        } catch (e) {
            console.log(e);
            setError("nickName", { message: "중복 확인 중 오류가 발생되었습니다." });
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
                                registration={register("username", {
                                    required: "아이디는 필수입니다.",
                                    minLength: { value: 4, message: "4자 이상 입력해주세요." },
                                    onChange: () => {
                                        // 중복확인을 해서 통과했을 때 사용자가 또 ID를 바꾼다면
                                        // 허가 사항을 취소할 필요가 있음
                                        setIsUsernameChecked(false);
                                        setUsernameMessage("");
                                    },
                                })}
                                error={errors.username?.message}
                            />
                            <Button
                                type={"button"}
                                variant={"secondary"}
                                onClick={handleCheckUsername}
                                className={twMerge(["w-32", "mt-6", "text-sm"])}>
                                중복확인
                            </Button>
                        </div>
                        {isUsernameChecked && (
                            <p className={twMerge(["text-success-main", "text-xs", "mt-[-10px]"])}>
                                {usernameMessage}
                            </p>
                        )}

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

                        <Input
                            label={"이메일"}
                            type={"email"}
                            placeholder={"example@wetube.com"}
                            error={errors.email?.message}
                            registration={register("email", {
                                required: "이메일은 필수입니다.",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "이메일 형식이 아닙니다.",
                                },
                            })}
                        />

                        <div className={twMerge(["flex", "gap-2"])}>
                            <Input
                                label={"닉네임"}
                                placeholder={"활동명을 입력해주세요"}
                                registration={register("nickName", {
                                    required: "닉네임은 필수입니다.",
                                })}
                                error={errors.nickName?.message}
                            />
                            <Button
                                type={"button"}
                                variant={"secondary"}
                                onClick={handleCheckNickname}
                                className={twMerge(["w-32", "mt-6", "text-sm"])}>
                                중복확인
                            </Button>
                        </div>
                        {isNicknameChecked && (
                            <p className={twMerge(["text-success-main", "text-xs", "mt-[-10px]"])}>
                                {nicknameMessage}
                            </p>
                        )}
                    </div>

                    {/* 개인정보 */}
                    <div className={"space-y-4"}>
                        <h3
                            className={twMerge(
                                ["pb-2"],
                                ["text-lg", "font-semibold"],
                                ["border-b", "border-divider"],
                            )}>
                            개인 정보
                        </h3>
                        <div className={twMerge(["flex", "justify-between", "gap-4"])}>
                            <Input
                                type={"date"}
                                label={"생년월일"}
                                registration={register("birthDate", {
                                    required: "생년월일을 선택해주세요.",
                                })}
                                error={errors.birthDate?.message}
                            />
                            <div className={twMerge(["flex", "flex-col", "gap-1", "w-full"])}>
                                <label className={twMerge(["text-sm", "font-medium"])}>성별</label>
                                <select
                                    className={twMerge(
                                        ["w-full", "px-3", "py-2"],
                                        [
                                            "text-sm",
                                            "text-text-default",
                                            "placeholder:text-text-disabled",
                                        ],
                                        [
                                            "border-divider",
                                            "border",
                                            "rounded-md",
                                            "bg-background-default",
                                        ],
                                        ["focus:outline-none", "focus:border-secondary-main"],
                                    )}
                                    {...register("gender", { required: true })}>
                                    <option value={"MALE"}>남성</option>
                                    <option value={"FEMALE"}>여성</option>
                                </select>
                            </div>
                        </div>

                        <Input
                            label={"휴대폰 번호"}
                            placeholder={"000-0000-0000"}
                            registration={register("phoneNumber", {
                                required: "전화번호는 필수입니다.",
                            })}
                            error={errors.phoneNumber?.message}
                        />
                    </div>

                    {/* 주소 정보 */}
                    <div className={"space-y-4"}>
                        <h3
                            className={twMerge(
                                ["pb-2"],
                                ["text-lg", "font-semibold"],
                                ["border-b", "border-divider"],
                            )}>
                            주소
                        </h3>
                        <div className={twMerge(["flex", "gap-2"])}>
                            <Input
                                readOnly
                                placeholder={"우편번호"}
                                registration={register("zipCode", {
                                    required: "주소는 필수입니다.",
                                })}
                                error={errors.zipCode?.message}
                            />
                            <Button
                                type={"button"}
                                variant={"secondary"}
                                className={twMerge(["w-32", "text-sm"])}>
                                주소찾기
                            </Button>
                        </div>

                        <Input
                            placeholder={"기본 주소"}
                            readOnly
                            error={errors.address1?.message}
                            registration={register("address1", { required: "필수" })}
                        />

                        <Input
                            placeholder={"상세 주소 (선택)"}
                            registration={register("address2")}
                        />
                    </div>

                    <Button size={"lg"} className={"w-full"} disabled={isSubmitting}>
                        {isSubmitting ? "가입 중..." : "회원가입"}
                    </Button>

                    <p className={twMerge(["text-center", "text-sm", "text-text-disabled"])}>
                        이미 계정이 있으신가요?{" "}
                        <Link
                            to={"/sign-in"}
                            className={twMerge(["text-secondary-main", "hover:underline"])}>
                            로그인하기
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
