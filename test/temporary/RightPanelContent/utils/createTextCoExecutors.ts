import { IUser } from "../../types/esbInterfaces";
import { ITaskMember } from "../../types/tasksInterfaces";
import { getCoExecutors } from "./getCoExecutors";
import { getUserFullName } from "./getUserFullName";

const createTextCoExecutors = (members: Array<ITaskMember>, users: Record<string, IUser>) => {
  const executors = getCoExecutors(members);

  return [
    executors.length > 1 ? 'Соисполнители' : 'Соисполнитель',
    executors.length > 0
      ? executors
          .map(
            ({
              endpoint: {
                user: { id },
              },
            }) => getUserFullName(users[id]),
          )
          .join(', ')
      : '',
  ];
};

export default createTextCoExecutors;
