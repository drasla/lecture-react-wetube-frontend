import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    registration?: Partial<UseFormRegisterReturn>;
    error?: string;
    labelClassName?: string;
}

function Input({ label, registration, error, className, labelClassName, ...props }: InputProps) {
    return (
        <div className={twMerge(["w-full", "flex", "flex-col", "gap-1"])}>
            {label && <label className={twMerge(["text-sm", "font-medium"], labelClassName)}>{label}</label>}
            <input
                className={twMerge(
                    ["w-full", "px-3", "py-2"],
                    ["text-sm", "text-text-default", "placeholder:text-text-disabled"],
                    ["border-divider", "border", "rounded-md", "bg-background-default"],
                    ["focus:outline-none", "focus:border-secondary-main"],
                    error && ["border-error-main", "focus:border-error-main"],
                    className,
                )}
                {...registration}
                {...props}
            />
            {error && <span className={twMerge(["text-xs", "text-error-main"])}>{error}</span>}
        </div>
    );
}

export default Input;
