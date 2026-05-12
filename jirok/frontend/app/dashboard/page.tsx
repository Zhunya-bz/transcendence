"use client"

import { useState } from "react";

interface Task {
    id: number;
    name: string;
    status: string;
}

export default function DashboardHome() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: 0, name: "Task 1", status: "todo" },
        { id: 1, name: "Task 2", status: "todo" },
        { id: 2, name: "Task 3", status: "in_progress" },
        { id: 3, name: "Task 4", status: "in_review" },
        { id: 4, name: "Task 5", status: "done" },
        { id: 5, name: "Task 6", status: "done" },
        { id: 6, name: "Task 7", status: "done" },
    ]);

    return (
        <div className="flex flex-row gap-4 width-full flex-1">
            <TaskStack status="todo" tasks={tasks.filter(task => task.status === "todo")} setTasks={setTasks} />
            <TaskStack status="in_progress" tasks={tasks.filter(task => task.status === "in_progress")} setTasks={setTasks} />
            <TaskStack status="in_review" tasks={tasks.filter(task => task.status === "in_review")} setTasks={setTasks} />
            <TaskStack status="done" tasks={tasks.filter(task => task.status === "done")} setTasks={setTasks} />
       </div>
    )
}

function TaskStack({ status, tasks, setTasks }: { status: string, tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>> }) {
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.dataTransfer?.getData('text');
        if (data) {
            setTasks((tasks) => [
                ...tasks.filter(task => task.id !== parseInt(data)),
                {
                    ...tasks.find(task => task.id === parseInt(data))!,
                    status,
                }
            ])
            console.log("DROP", data);
        }
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return <div
        className="flex-1 flex flex-col gap-4 min-w-[90px] bg-amber-50 p-4 rounded-md"
        onDrop={onDrop}
        onDragOver={onDragOver}
    >
        <h1 className="pl-4 font-bold">{status.replaceAll("_", " ").toUpperCase()}</h1>
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        <TaskAdd />
    </div>
}

function TaskCard({ task }: { task: Task }) {
    const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("text", task.id.toString());
    }

    return <div
        className="flex flex-row gap-4 bg-blue-50 p-2 rounded-md border-2"
        draggable
        onDragStart={onDragStart}
    >
        <div className="w-full p-2">{task.name}</div>
    </div>
}

function TaskAdd() {
    return <h1 className="text-center">+ task</h1>
}