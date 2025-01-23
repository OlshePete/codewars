import { TAllTasks, TSubtasks, TasksStatus } from '../../../../types/tasksInterfaces';

export function isTaskStartEditDisabled(
  task: TAllTasks | TSubtasks | null | Array<TAllTasks | TSubtasks>,
): boolean {
  const disabledStatus = [
    TasksStatus.Running,
    TasksStatus.Succeed,
    TasksStatus.Failed,
    TasksStatus.Archived,
  ];
  let result = true;

  if (!task) return result;
  const isArray = Array.isArray(task);

  if (isArray) {
    result = task.some(({ task }) => disabledStatus.includes(task.state.status));
  } else {
    result = disabledStatus.includes(task.task.state.status);
  }

  return result;
}
