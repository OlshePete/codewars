import { TAllTasks } from '../../../../types/tasksInterfaces';

export const isSubtask = (task: TAllTasks | null) => {
  if (task && task.parent) {
    return true;
  }

  return false;
};
