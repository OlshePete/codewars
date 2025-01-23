import { IUser } from "../../types/esbInterfaces";
import { ITaskMember } from "../../types/tasksInterfaces";
import { getObservers } from "./getObservers";
import { getUserFullName } from "./getUserFullName";

export const createTextObservers = (members: Array<ITaskMember>, users: Record<string, IUser>) => {
  const observers = getObservers(members);

  return [
    observers.length > 1 ? 'Наблюдатели' : 'Наблюдатель',
    observers.length > 0
      ? observers
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

export default createTextObservers;
