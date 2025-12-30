// 기본적으로 나와야 하는 템플릿 type을 지정해서 손쉽게 꺼내 쓸 수 있도록 type 마련
import {create} from "zustand";
import {persist} from "zustand/middleware";

type ModalType = "LOGIN_REQUIRED" | "ADDRESS_SEARCH" | null;

interface ModalState {
    isOpen: boolean;
    type: ModalType;
    props?: any;

    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
}

export const useModalStore = create<ModalState>()(
    persist(
        set => ({
            isOpen: false,
            type: null,
            props: undefined,

            openModal: (type, props) => set({ isOpen: true, type, props }),
            closeModal: () => set({ isOpen: false, type: null, props: undefined})
        }),
        { name: "wetube-modal"}
    )
)