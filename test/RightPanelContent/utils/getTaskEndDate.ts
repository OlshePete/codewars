import { TAllTasks, TasksStatus } from '../../../../types/tasksInterfaces';

const resolvedStatuses = [TasksStatus.Succeed, TasksStatus.Failed, TasksStatus.Archived];

export const getTaskEndDate = (task: TAllTasks | null, taskHistory: TAllTasks[] | undefined) => {
  // в отсортированном массиве истории берем последний статус, если он завершающий возвращаем дату
  let result = NaN;

  if (taskHistory && task) {
    const history = [...taskHistory];
    history.unshift(task);
    const sortedHistory = history.sort(
      (a, b) => Number(b?.task.state.begin ?? 0) - Number(a?.task.state.begin ?? 0),
    );
    const currentState = sortedHistory[0].task.state;

    if (resolvedStatuses.includes(currentState.status)) result = currentState.begin ?? NaN;
  }

  return result;
};
