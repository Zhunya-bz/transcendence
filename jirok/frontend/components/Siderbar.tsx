"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "./Navigation";
import { ModalCreateProject } from "./modal-create-project";

interface SidebarProps {
    onNavigate?: () => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
    const pathname = usePathname();
    const projectIdMatch = pathname.match(/\/projects\/(\d+)\/([^\/]+)/);
    const projectId = projectIdMatch?.[1] ?? null;

    return (
        <aside className="h-full bg-white p-4 pt-12 w-full">
            <ModalCreateProject projectId={projectId} />
            <Navigation onNavigate={onNavigate} />
        </aside>
    )
}