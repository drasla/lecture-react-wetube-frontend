import { twMerge } from "tailwind-merge";

type BackdropProps = {
    onClose: () => void;
};

function Backdrop({ onClose }: BackdropProps) {
    return (
        <div
            onClick={onClose}
            className={twMerge([
                "fixed",
                "inset-0",
                "cursor-default",
                "bg-black/60",
                "backdrop-blur-sm",
            ])}
        />
    );
}

export default Backdrop;
