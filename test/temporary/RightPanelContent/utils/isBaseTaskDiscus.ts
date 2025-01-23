import { IBaseTask, ITaskDiscus, TViewTask } from "../../types/tasksInterfaces";

export function isBaseTaskDiscus(task: TViewTask): task is IBaseTask<ITaskDiscus> {
  return task !== null && 'task' in task && 'discus' in task.task;
}
