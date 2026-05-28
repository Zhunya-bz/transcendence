"use client"

import { use, useCallback, useState } from "react";
import { getTask, type TaskItem, type TaskStatus } from "@/actions/issues";
import { useQuery } from "@tanstack/react-query";

interface DashboardPageProps {
    params: Promise<{ projectId: string; projectKey: string, issueId: string; }>;
}

export default function IssuePage({ params }: DashboardPageProps) {
    const { projectId, issueId } = use(params);

    const { data, refetch, isFetched } = useQuery<TaskItem>({
        queryKey: ["backlog", projectId, issueId],
        queryFn: () => getTask(projectId, issueId),
    });

    const update = useCallback(async (task: Partial<TaskItem>) => {
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
                        <option value="BUG">Bug</option>
                        <option value="TASK">Task</option>
                        <option value="STORY">Story</option>
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
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
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
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
