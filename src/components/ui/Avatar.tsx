import { twMerge } from "tailwind-merge";

type AvatarProps = {
    src?: string | null;
    nickname: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    onClick?: VoidFunction;
    className?: string;
};

function Avatar({ src, nickname, size = "md", onClick, className }: AvatarProps) {
    const sizeClasses = {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-14 h-14",
        xl: "w-32 h-32",
    };

    return (
        <div
            className={twMerge(
                ["flex", "justify-center", "items-center", "relative"],
                [
                    "rounded-full",
                    "overflow-hidden",
                    "border",
                    "border-divider",
                    "bg-background-paper",
                ],
                sizeClasses[size],
                className,
            )}
            onClick={onClick}>
            {src ? (
                <img
                    src={src}
                    alt={nickname}
                    className={twMerge(["w-full", "h-full", "object-cover"])}
                />
            ) : (
                <div
                    className={twMerge([
                        "w-full",
                        "h-full",
                        "flex",
                        "justify-center",
                        "items-center",
                    ],
                    ["bg-primary-main", "text-white", "font-bold"])}>
                    {nickname[0].toUpperCase()}
                </div>
            )}
        </div>
    );
}

export default Avatar;
