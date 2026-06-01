"use client"

import { use, useCallback} from "react";
import { getTask } from "@/actions/issues";
import { useQuery } from "@tanstack/react-query";
import { Issue, IssuePriority, IssueStatus, IssueType } from "@/types/prisma";

interface DashboardPageProps {
    params: Promise<{ projectId: string; projectKey: string, issueId: string; }>;
}

export default function IssuePage({ params }: DashboardPageProps) {
    const { projectId, issueId } = use(params);

    const { data, refetch, isFetched } = useQuery<Issue>({
        queryKey: ["backlog", projectId, issueId],
        queryFn: () => getTask(projectId, issueId),
    });

    const update = useCallback(async (task: Partial<Issue>) => {
        if (!data) return;

        await fetch(`http://localhost:3001/projects/${projectId}/issues/${data.id}`, {
            body: JSON.stringify(task),
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }, []);

    if (!isFetched || !data) {
        return <div>loading...</div>
    }

    return (
        <div className="flex flex-row gap-4 width-full flex-1">
            <div className="flex flex-col gap-4 width-full flex-1">
                <input
                    className="text-xl bold"
                    defaultValue={data.title}
                    onChange={(e) => update({
                        title: e.target.value
                    })}
                />
                <textarea
                    defaultValue={data.description}
                    placeholder="description"
                    onChange={(e) => update({
                        description: e.target.value
                    })}
                />
            </div>
            <div>
                <div className="flex flex-row gap-4">
                    <label>Type</label>
                    <select
                        className="flex-1"
                        onChange={e => update({
                            type: e.target.value
                        })}
                        defaultValue={data.type}
                    >
                        <option value={IssueType.BUG}>Bug</option>
                        <option value={IssueType.TASK}>Task</option>
                        <option value={IssueType.STORY}>Story</option>
                    </select>
                </div>

                <div className="flex flex-row gap-4">
                    <label>Priority</label>
                    <select
                        className="flex-1"
                        onChange={e => update({
                            priority: e.target.value
                        })}
                        defaultValue={data.priority}
                    >
                        <option value={IssuePriority.LOW}>Low</option>
                        <option value={IssuePriority.MEDIUM}>Medium</option>
                        <option value={IssuePriority.HIGH}>High</option>
                    </select>
                </div>

                <div className="flex flex-row gap-4">
                    <label>Status</label>
                    <select
                        className="flex-1"
                        onChange={e => update({
                            status: e.target.value
                        })}
                        defaultValue={data.status}
                    >
                        <option value={IssueStatus.TODO}>Todo</option>
                        <option value={IssueStatus.IN_PROGRESS}>In Progress</option>
                        <option value={IssueStatus.IN_REVIEW}>In Review</option>
                        <option value={IssueStatus.DONE}>Done</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
