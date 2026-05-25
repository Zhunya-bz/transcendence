import { type TaskItem, type TaskStatus } from "@/actions/issues";
import { getTypeIcon, getTypeClasses, getStatusLabel, getPriorityLabel, getStatusClasses, getPriorityClasses } from "./TaskTable"

export function TaskStack({
  status,
  tasks,
  setTask,
  showAdd = true,
}: { status: TaskStatus, tasks: TaskItem[], setTask: (task: TaskItem) => void, showAdd?: boolean }) {
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer?.getData('text');
    if (data) {
      setTask({
        ...tasks.find(task => task.id === parseInt(data))!,
        status,
      })
      console.log("DROP", data);
    }
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  return <div
    className="flex-1 flex flex-col gap-1 min-w-[90px] bg-[rgba(241,114,16,0.2)] bg-opacity-25 p-1 pt-3 rounded-md"
    onDrop={onDrop}
    onDragOver={onDragOver}
  >
    <h1 className="pl-4 font-bold">{status.replaceAll("_", " ").toUpperCase()} <span>({tasks.length})</span></h1>
    {tasks.map(task => <TaskCard key={task.id} task={task} />)}
    {showAdd && <TaskAdd status={status} setTask={setTask} />}
  </div>
}


function TaskCard({ task }: { task: TaskItem }) {
  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text", task.id.toString());
  }

    const TypeIcon = getTypeIcon(task.type)
  return <div
    className="flex flex-col gap-4 bg-blue-50 p-2 rounded-md border-2"
    draggable
    onDragStart={onDragStart}
  >
    <div className="w-full p-2">{task.title}</div>
    <div className="flex flex-row">
        <TypeIcon className={`size-4 ${getTypeClasses(task.type)}`} />
        <span className="inline-flex items-baseline px-2 py-0.5 text-xs font-mono text-blue-700">
            t-{task.id} {/* todo: use the real project key */}
        </span>
        <div className="text-gray-500 flex-1">Unassigned</div>
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(task.priority)}`}
        >
        {getPriorityLabel(task.priority)}
        </span>
    </div>
  </div>
}

function TaskAdd({ setTask, status }: { status: string, setTask: (task: TaskItem) => void }) {
  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const text = e.target.querySelector('#task-add-text')?.innerText;
    if (text) {
      setTask({
        id: tasks.length + 1,
        name: text,
        status
      })
      e.target.innerText = ""
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
