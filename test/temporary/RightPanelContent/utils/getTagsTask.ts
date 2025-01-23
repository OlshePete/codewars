import { ITaskExtra, ITaskTag, TViewTask } from "../../types/tasksInterfaces";

export const getTagsTask = (task: TViewTask) => {
    let tags: Record<string, ITaskTag> = {};
    if (task && 'task' in task && 'extra' in task.task) {
      try {
        const extraParse = JSON.parse(task.task.extra) as ITaskExtra;
        tags = extraParse.tags;
      } catch (err) {
        console.log('skifTaskList[error]');
        console.log(err);
      }
    }
    return tags;
  };