import { TSubtasks, TViewTask } from '../../../../types/tasksInterfaces';
import { getMembersWithoutObserves, membersToObservers } from '../../kanban/utils/usersUtils';
import { defineMembers } from './defineMembers';

export const getUpdateTask = (
  task: NonNullable<TViewTask>,
  subtask: TSubtasks,
): NonNullable<TViewTask> => {
  const membersTask = task.task.members;
  const membersSubtask = subtask.task.members;

  const membersTaskWithoutObserves = getMembersWithoutObserves(membersTask);
  const updateObserversTask = membersToObservers([...membersTask, ...membersSubtask]);

  const updateMembersTask = defineMembers(
    updateObserversTask,
    membersTaskWithoutObserves,
    task.task.author.user.id,
  );

  return JSON.parse(
    JSON.stringify({
      ...task,
      task: {
        ...task.task,
        members: updateMembersTask,
      },
    }),
  );
};
