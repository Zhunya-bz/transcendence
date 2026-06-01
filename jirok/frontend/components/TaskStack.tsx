import { getTypeIcon, getTypeClasses, getStatusLabel, getPriorityLabel, getStatusClasses, getPriorityClasses } from "./TaskTable"
import { Issue, IssuePriority, IssueStatus, IssueType } from "@/types/prisma";

export const DEFAULT: Partial<Issue> = {
    status: IssueStatus.TODO,
    type: IssueType.TASK,
    priority: IssuePriority.MEDIUM,
};

export function TaskStack({
    status,
    tasks,
    setTask,
    projectId,
    projectKey,
    showAdd = true,
}: { status: IssueStatus, tasks: Issue[], setTask: (task: Partial<Issue>) => void, projectId: string, projectKey: string, showAdd?: boolean }) {
    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const data = e.dataTransfer?.getData('text');
        if (data) {
            setTask({
                id: parseInt(data),
                status,
            })
        }
    }

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return <div
        className="flex-1 flex flex-col gap-1 min-w-[90px] p-1 pt-3 rounded-md bg-[rgba(255,184,106,0.1)]"
        onDrop={onDrop}
        onDragOver={onDragOver}
    >
        <h1 className="pl-4 font-bold">{status.replaceAll("_", " ").toUpperCase()} <span>({tasks.length})</span></h1>
        {tasks.map(task => <TaskCard key={task.id} task={task} projectId={projectId} projectKey={projectKey} />)}
        {showAdd && <TaskAdd status={status} setTask={setTask} />}
    </div>
}


function TaskCard({ task, projectId, projectKey }: { task: Issue, projectId: string, projectKey: string }) {
    const onDragStart = (e: React.DragEvent<HTMLAnchorElement>) => {
        e.dataTransfer.setData("text", task.id.toString());
    }

    const TypeIcon = getTypeIcon(task.type)
    return <a
        className="flex flex-col gap-4 p-4 rounded-md border-2 select-none cursor-pointer hover:bg-blue-100 bg-white"
        draggable
        onDragStart={onDragStart}
        href={`/projects/${projectId}/${projectKey}/issues/${task.id}`}
    >
        <div className="w-full">{task.title}</div>
        <div className="flex flex-row items-center">
            <TypeIcon className={`size-4 ${getTypeClasses(task.type)}`} />
            <span className="inline-flex items-baseline px-2 py-0.5 text-xs font-mono text-blue-700">
                {projectKey}-{task.id}
            </span>
            <div className="text-gray-500 flex-1">Unassigned</div>
            <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(task.priority)}`}
            >
                {getPriorityLabel(task.priority)}
            </span>
        </div>
    </a>
}

function TaskAdd({ setTask, status }: { status: IssueStatus, setTask: (task: Partial<Issue>) => void }) {
    const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        const taskAddText = e.currentTarget.querySelector('#task-add-text') as HTMLDivElement | null;
        const text = taskAddText?.innerText;
        if (text) {
            setTask({
                ...DEFAULT,
                title: text,
                status
            })
            if (taskAddText) {
                taskAddText.innerText = ""
            }
        }
    }

    return <h1
        className="opacity-0 hover:opacity-50 bg-blue-50 p-2 rounded-md border-2"
        onMouseLeave={onMouseLeave}
    >
        <div
            className="p-2"
            contentEditable
            id="task-add-text"
        ></div>
    </h1>
}
