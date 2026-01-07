import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutStore {
    isSidebarOpen: boolean;
    toggleSidebar: VoidFunction;
    closeSidebar: VoidFunction;
}

export const useLayoutStore = create<LayoutStore>()(
    persist(
        set => ({
            isSidebarOpen: true,
            toggleSidebar: () => set(
                state => (
                    { isSidebarOpen: !state.isSidebarOpen }
                )
            ),
            closeSidebar: () => set({ isSidebarOpen: false})
        }),
        {name: "wetube-layout"}
    )
)