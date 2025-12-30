import { twMerge } from "tailwind-merge";
import Button from "../Button.tsx";
import { Link } from "react-router";

type LoginRequiredModalProps = {
    onClose: VoidFunction;
};

function LoginRequiredModal({ onClose }: LoginRequiredModalProps) {
    return (
        <div
            className={twMerge(
                ["w-full", "p-4"],
                ["bg-background-paper", "rounded-lg", "shadow-xl"],
                ["border", "border-divider"],
            )}>
            <h2 className={twMerge(["text-lg", "font-bold", "mb-4"])}>로그인 필요</h2>
            <p className={twMerge(["text-text-disabled", "mb-4"])}>
                이 기능을 사용하려면 로그인이 필요합니다
            </p>
            <div className={twMerge(["flex", "justify-center", "gap-2"])}>
                <Button onClick={onClose} variant={"info"}>
                    닫기
                </Button>
                <Link to={"/sign-in"} onClick={onClose} className={twMerge(["px-4", "py-2"])}>
                    로그인하기
                </Link>
            </div>
        </div>
    );
}

export default LoginRequiredModal;
