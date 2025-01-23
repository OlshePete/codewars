import { ITaskTag } from "../../types/tasksInterfaces";

export const getColorTask = (tags: Record<string, ITaskTag>) => {
  const keys = Object.keys(tags);

  return keys.length === 1 ? tags[keys[0]].color : '';
};
