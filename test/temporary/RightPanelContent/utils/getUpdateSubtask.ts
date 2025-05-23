import { TViewTask } from '../../types/tasksInterfaces';
import { defineMembers } from './defineMembers';
import { getExecutors } from './getExecutors';
import { getMembersWithoutObserves } from './getMembersWithoutObserves';
import { getObservers } from './getObservers';
import { membersToObservers } from './membersToObservers';

export const getUpdateSubtask = <K extends NonNullable<TViewTask>>(
  task: NonNullable<TViewTask>,
  subtask: K,
): K => {
  const membersTask = task.task.members;
  const membersSubtask = subtask.task.members;
  const membersTaskWithoutObserves = getMembersWithoutObserves(membersTask);
  const membersSubtaskWithoutObserves = getMembersWithoutObserves(membersSubtask);
  const executorsSubtask = getExecutors(membersSubtask);

  if (executorsSubtask.length === 0) {
    const executors = getExecutors(membersTask);
    membersSubtaskWithoutObserves.push(...executors);
  }

  const updateObserversSubtask = membersToObservers([
    ...membersTaskWithoutObserves,
    ...getObservers(membersSubtask),
  ]);

  const updateMembersSubtask = defineMembers(
    updateObserversSubtask,
    membersSubtaskWithoutObserves,
    subtask.task.author.user.id,
  );
  const { lifetime: _, ...timeframe } = subtask.task.timeframe;

  return JSON.parse(
    JSON.stringify({
      ...subtask,
      task: {
        ...subtask.task,
        timeframe: timeframe,
        members: updateMembersSubtask,
      },
    }),
  );
};
