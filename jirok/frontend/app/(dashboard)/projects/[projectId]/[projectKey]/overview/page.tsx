"use client";

import { getProjectActivity } from "@/actions/projects";
import {
  IssuePriority,
  IssueStatus,
  IssueType,
  User,
} from "@/types/prisma";
import { useQuery } from "@tanstack/react-query";
import { use, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface OverviewPageProps {
  params: Promise<{ projectId: string; projectKey: string }>;
}

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  [IssuePriority.HIGH]: "#ef4444",
  [IssuePriority.MEDIUM]: "#f59e0b",
  [IssuePriority.LOW]: "#10b981",
};

const TYPE_COLORS: Record<IssueType, string> = {
  [IssueType.BUG]: "#f97316",
  [IssueType.TASK]: "#2563eb",
  [IssueType.STORY]: "#8b5cf6",
};

export default function OverviewPage({ params }: OverviewPageProps) {
  const { projectId, projectKey } = use(params);

  const { data: activity} = useQuery({
    queryKey: ["project-activity", projectId],
    queryFn: () => getProjectActivity(projectId),
  });

  const statusCounts: Partial<Record<IssueStatus, number>> = activity?.statusCounts ?? {};
  const typeCounts: Partial<Record<IssueType, number>> = activity?.typeCounts ?? {};
  const priorityCounts: Partial<Record<IssuePriority, number>> = activity?.priorityCounts ?? {};
const assigneeCounts: { user: User | null; count: number }[] = activity?.assigneeCounts ?? [];

  const totalTasks = Object.values(statusCounts).reduce((sum: number, count) => sum + (count ?? 0), 0);
  const doneTasks = statusCounts[IssueStatus.DONE] ?? 0;
  const memberCount = assigneeCounts.length > 0 ? assigneeCounts.length - 1 : 0;
  const completionPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const priorityData = [IssuePriority.HIGH, IssuePriority.MEDIUM, IssuePriority.LOW].map((priority) => {
    const count = priorityCounts[priority] ?? 0;
    return {
      name: priority,
      count,
      percent: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
    };
  });

  const typeData = [IssueType.BUG, IssueType.TASK, IssueType.STORY].map((type) => {
    const count = typeCounts[type] ?? 0;
    return {
      name: type,
      value: count,
    };
  });

  const assigneeData = assigneeCounts
    .map((entry) => {
      const name = entry.user ? `${entry.user.name} ${entry.user.surname ?? ""}`.trim() : "Unassigned";
      return {
        name,
        count: entry.count,
        percent: totalTasks > 0 ? Math.round((entry.count / totalTasks) * 100) : 0,
      };
    })
    .sort((left, right) => right.count - left.count);


  return (
    <div className="flex flex-col gap-6 pb-8">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Overview</h1>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Created tasks" value={totalTasks} subtitle="All tasks in this project"  />
        <MetricCard title="Done tasks" value={doneTasks} subtitle="Tasks already completed"  />
        <MetricCard title="Members" value={memberCount} subtitle="Project team size"  />
        <MetricCard title="Work done" value={`${completionPercent}%`} subtitle="Percent of tasks completed"  />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Tasks by priority" description="Share of the backlog grouped by priority.">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={priorityData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `${value}%`} tick={{ fill: "#475569", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value ?? 0}%`, "Percentage"]} />
              <Legend />
              <Bar dataKey="percent" name="Percentage" radius={[8, 8, 0, 0]}>
                {priorityData.map((entry) => (
                  <Cell key={entry.name} fill={PRIORITY_COLORS[entry.name as IssuePriority]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tasks by type" description="Composition of task types in the project.">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={3}
                label={(payload: { name?: string; percent?: number }) => `${payload.name ?? ""} ${(payload.percent ? payload.percent * 100 : 0).toFixed(0)}%`}
              >
                {typeData.map((entry) => (
                  <Cell key={entry.name} fill={TYPE_COLORS[entry.name as IssueType]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value ?? 0, "Tasks"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-slate-900">Tasks by assignee</h2>
          <p className="text-sm text-slate-500">
            Percentage of tasks assigned to each member, including unassigned work.
          </p>
        </div>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={assigneeData} layout="vertical" margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#475569", fontSize: 12 }}
            />
            <YAxis type="category" dataKey="name" width={130} tick={{ fill: "#475569", fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value ?? 0}%`, "Percentage"]} />
            <Legend />
            <Bar dataKey="percent" name="Percentage" fill="#2563eb" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </div>
  );
}
