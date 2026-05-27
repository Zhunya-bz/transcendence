"use client";
import { AiFillProject, AiOutlineProject } from "react-icons/ai";
import { PiListChecks, PiListChecksFill } from "react-icons/pi";
import {
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
  MdOutlineLeaderboard,
  MdLeaderboard,
  MdPeople,
  MdPeopleAlt,
} from "react-icons/md";
import { GoCheckCircle, GoCheckCircleFill } from "react-icons/go";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
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
    href: "backlog?assignee=me",
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
  {
    label: "Members",
    href: "members",
    requiresProject: true,
    icon: MdPeople,
    activeIcon: MdPeopleAlt,
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectIdMatch = pathname.match(/\/projects\/(\d+)\/([^\/]+)/);
  const projectId = projectIdMatch?.[1] ?? null;
  const projectKey = projectIdMatch?.[2] ?? null;
  const isBacklogPath = pathname.includes("/backlog");
  const isMyTasks = isBacklogPath && searchParams.get("assignee") === "me";
  const isBacklog = isBacklogPath && !searchParams.get("assignee");

  return (
    <>
      <ul className="flex flex-col">
        {routes.map((item) => {
          const href = item.requiresProject
            ? `/projects/${projectId}/${projectKey}/${item.href}`
            : item.href;

          let isActive = false;
          if (item.requiresProject) {
            if (item.href === "backlog?assignee=me") {
              isActive = isMyTasks;
            } else if (item.href === "backlog") {
              isActive = isBacklog;
            } else {
              const basePath = `/projects/${projectId}/${projectKey}/${item.href}`;
              isActive = pathname.startsWith(basePath);
            }
          } else {
            isActive = pathname === href;
          }

          const isDisabled = item.requiresProject && !projectId;
          const Icon = isActive ? item.activeIcon : item.icon;

          if (isDisabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 p-3 rounded-md font-medium text-neutral-300 cursor-not-allowed"
              >
                <Icon className="size-5" />
                {item.label}
              </div>
            );
          }

          return (
            <Link key={item.href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md font-medium transition text-neutral-500 hover:text-primary",
                  isActive && "bg-orange-300 shadow-sm text-primary",
                )}
              >
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
