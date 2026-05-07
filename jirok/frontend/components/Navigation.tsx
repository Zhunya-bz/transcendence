import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { AiFillProject, AiOutlineProject } from "react-icons/ai";
import { PiListChecks, PiListChecksFill } from "react-icons/pi";
import { MdOutlineSpaceDashboard, MdSpaceDashboard, MdOutlineLeaderboard, MdLeaderboard } from "react-icons/md";
import Link from "next/link";
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
    href: "/board",
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
  }
];

export const Navigation = () => {
    return (
        <ul className="flex flex-col ">
            {routes.map((item) => {
                const isActive = false;
                const Icon = isActive ? item.activeIcon : item.icon;
                return (
                    <Link key={item.href} href={item.href}>
                        <div className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                        )}>
                            <Icon className="size-5 text-neutral-500"/>
                            {item.label}
                        </div>
                    </Link>

                );
            })}
        </ul>
    )
}