"use client";
import { AiFillProject, AiOutlineProject } from "react-icons/ai";
import { PiListChecks, PiListChecksFill } from "react-icons/pi";
import { MdOutlineSpaceDashboard, MdSpaceDashboard, MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import { GoCheckCircle, GoCheckCircleFill } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { ModalCreateProject } from "./modal-create-project";

const routes = [
  {
    label: "Projects",
    href: "/projects",
    icon: AiOutlineProject,
    activeIcon: AiFillProject,
  },
  {
    label: "Backlog",
    href: "backlog",
    requiresProject: true,
    icon: PiListChecks,
    activeIcon: PiListChecksFill,
  },
  {
    label: "Board",
    href: "dashboard",
    requiresProject: true,
    icon: MdOutlineSpaceDashboard,
    activeIcon: MdSpaceDashboard,
  },
  {
    label: "My Tasks",
    href: "my-tasks",
    requiresProject: true,
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Overview",
    href: "overview",
    requiresProject: true,
    icon: MdOutlineLeaderboard,
    activeIcon: MdLeaderboard,
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const projectIdMatch = pathname.match(/\/projects\/(\d+)/);
  const projectId = projectIdMatch?.[1] ?? null;

  return (
    <>
      <ModalCreateProject projectId={projectId}/>
      <Separator className="my-4" />

      <ul className="flex flex-col">
        {routes.map((item) => {
          const href = item.requiresProject
            ? `/projects/${projectId}/${item.href}`
            : item.href;
          const isActive = item.requiresProject
            ? pathname.startsWith(href)
            : pathname === href;
          const isDisabled = item.requiresProject && !projectId;
          const Icon = isActive ? item.activeIcon : item.icon;

          if (isDisabled) {
            return (
              <div key={item.href} className="flex items-center gap-3 p-3 rounded-md font-medium text-neutral-300 cursor-not-allowed">
                <Icon className="size-5" />
                {item.label}
              </div>
            );
          }

          return (
            <Link key={item.href} href={href}>
              <div className={cn(
                "flex items-center gap-3 p-3 rounded-md font-medium transition text-neutral-500 hover:text-primary",
                isActive && "bg-orange-300 shadow-sm text-primary",
              )}>
                <Icon className="size-5" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </ul>
    </>
  );
};