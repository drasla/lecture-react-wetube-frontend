import { twMerge } from "tailwind-merge";

type BackdropProps = {
    onClose: () => void;
    className?: string;
};

function Backdrop({ onClose, className }: BackdropProps) {
    return (
        <div
            onClick={onClose}
            className={twMerge(
                ["fixed", "inset-0", "cursor-default", "bg-black/60", "backdrop-blur-sm"],
                className,
            )}
        />
    );
}

export default Backdrop;
