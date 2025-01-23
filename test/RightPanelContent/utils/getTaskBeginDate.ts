import { TAllTasks, TasksStatus, isTaskTimeframe } from '../../../../types/tasksInterfaces';

export const getTaskBeginDate = (task: TAllTasks | null, taskHistory: TAllTasks[] | undefined) => {
  let result = NaN;

  if (taskHistory && task) {
    const history = [...taskHistory];
    history.unshift(task);
    let min = task.task.state.begin;
    for (const it of history) {
      if (
        it.task.state.status === TasksStatus.Running &&
        it.task.state.begin &&
        min &&
        it.task.state.begin <= min
      ) {
        min = it.task.state.begin;
        result = it.task.state.begin ?? NaN;
      }
    }

    if (isTaskTimeframe(task) && isNaN(result)) {
      if (task.task.timeframe.begin) {
        result = task.task.timeframe.begin;
      }
    }
  }

  return result;
};
