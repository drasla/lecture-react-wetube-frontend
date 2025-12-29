import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "warning"
        | "info"
        | "outline"
        | "ghost";
    size?: "sm" | "md" | "lg";
}

function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
    return (
        <button
            className={twMerge(
                ["flex", "justify-center", "items-center"],
                ["rounded-md"],
                ["font-medium", "cursor-pointer"],
                ["disabled:pointer-events-none", "disabled:opacity-50"],
                variant === "primary" && [
                    "bg-primary-main",
                    "text-primary-contrastText",
                    "hover:bg-primary-dark",
                ],
                variant === "secondary" && [
                    "bg-background-default",
                    "border",
                    "border-divider",
                    "text-text-default",
                    "hover:bg-text-default/10",
                ],
                variant === "success" && [
                    "bg-success-main",
                    "text-success-contrastText",
                    "hover:bg-success-dark",
                ],
                variant === "error" && [
                    "bg-error-main",
                    "text-error-contrastText",
                    "hover:bg-error-dark",
                ],
                variant === "warning" && [
                    "bg-warning-main",
                    "text-warning-contrastText",
                    "hover:bg-warning-dark",
                ],
                variant === "info" && [
                    "bg-info-main",
                    "text-info-contrastText",
                    "hover:bg-info-dark",
                ],
                variant === "outline" && [
                    "border",
                    "border-secondary-main",
                    "text-secondary-main",
                    "hover:bg-secondary-main/10",
                ],
                variant === "ghost" && ["hover:bg-text-default/10", "text-text-default"],
                size === "sm" && ["h-8", "px-3", "text-xs"],
                size === "md" && ["h-10", "px-4", "py-2"],
                size === "lg" && ["h-12", "px-8", "text-lg"],
                className,
            )}
            {...props}
        />
    );
}

export default Button;
