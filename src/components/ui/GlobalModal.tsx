import { useModalStore } from "../../store/useModalStore.ts";
import { twMerge } from "tailwind-merge";
import Backdrop from "./Backdrop.tsx";
import { MdClose } from "react-icons/md";
import AddressSearchModal from "./modals/AddressSearchModal.tsx";
import LoginRequiredModal from "./modals/LoginRequiredModal.tsx";

function GlobalModal() {
    const { isOpen, type, props, closeModal } = useModalStore();

    if (!isOpen) return null;

    return (
        <div
            className={twMerge(
                ["fixed", "inset-0", "z-50"],
                ["flex", "justify-center", "items-center"],
            )}>
            {/* 백드롭 */}
            <Backdrop onClose={closeModal} />

            {/* 모달 */}
            <div className={twMerge(["z-10", "relative", "w-full", "max-w-[500px]", "p-4"])}>
                <button
                    className={twMerge(
                        ["absolute", "-top-10", "right-0"],
                        ["text-white", "hover:text-gray-300", "transition-all"],
                    )}
                    onClick={closeModal}>
                    <MdClose size={32} />
                </button>

                {type === "ADDRESS_SEARCH" && (
                    <AddressSearchModal props={props} onClose={closeModal} />
                )}
                {type === "LOGIN_REQUIRED" && <LoginRequiredModal onClose={closeModal} />}
            </div>
        </div>
    );
}

export default GlobalModal;
