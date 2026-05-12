"use client";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { AiFillProject, AiOutlineProject } from "react-icons/ai";
import { PiListChecks, PiListChecksFill } from "react-icons/pi";
import {
  MdOutlineSpaceDashboard,
  MdSpaceDashboard,
  MdOutlineLeaderboard,
  MdLeaderboard,
} from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Projects",
    href: "/projects",
    icon: AiOutlineProject,
    activeIcon: AiFillProject,
  },
  {
    label: "Backlog",
    href: "/backlog",
    icon: PiListChecks,
    activeIcon: PiListChecksFill,
  },
  {
    label: "Board",
    href: "/dashboard",
    icon: MdOutlineSpaceDashboard,
    activeIcon: MdSpaceDashboard,
  },
  {
    label: "My tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Project Overview",
    href: "/project-overview",
    icon: MdOutlineLeaderboard,
    activeIcon: MdLeaderboard,
  },
];

export const Navigation = () => {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col ">
      {routes.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-3 p-3 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive &&
                  "bg-orange-300 shadow-sm hover:opacity-100 text-primary",
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
