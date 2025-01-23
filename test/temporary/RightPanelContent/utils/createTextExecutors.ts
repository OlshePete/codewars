import { IUser } from "../../types/esbInterfaces";
import { ITaskMember } from "../../types/tasksInterfaces";
import { getExecutors } from "./getExecutors";
import { getUserFullName } from "./getUserFullName";

const createTextExecutors = (members: Array<ITaskMember>, users: Record<string, IUser>) => {
  const executors = getExecutors(members);

  return [
    executors.length > 1 ? 'Исполнители' : 'Исполнитель',
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

export default createTextExecutors;
