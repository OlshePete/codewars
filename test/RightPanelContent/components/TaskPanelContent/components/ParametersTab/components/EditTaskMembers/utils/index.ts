import { IModule, IUser } from '../../../../../../../../../../types/esbInterfaces';
import { ITaskMember } from '../../../../../../../../../../types/tasksInterfaces';
import { MemberRights } from '../../../../../../../../../consts';
import {
  getCoExecutors,
  getExecutors,
  getObservers,
  getUserFullName,
} from '../../../../../../../../kanban/utils/usersUtils';

export const getMembersData = (members: Array<ITaskMember>, users: Record<string, IUser>) =>
  members.map((member) => {
    const { id } = member.endpoint.user;
    const fullName = getUserFullName(users[id]);

    return { fullName, id };
  });

export const getDefaultExecutors = (members: Array<ITaskMember>, users: Record<string, IUser>) => {
  const executors = getExecutors(members);

  return getMembersData(executors, users);
};

export const getDefaultCoExecutors = (
  members: Array<ITaskMember>,
  users: Record<string, IUser>,
) => {
  const coExecutors = getCoExecutors(members);

  return getMembersData(coExecutors, users);
};

export const getDefaultObservers = (members: Array<ITaskMember>, users: Record<string, IUser>) => {
  const observers = getObservers(members);

  return getMembersData(observers, users);
};

const createMember = (
  userId: string,
  modules: Record<string, IModule>,
  userModules: Record<string, string>,
): Omit<ITaskMember, 'rights'> => {
  //TODO Разобраться с бэком, что делать если у участника нет модуля
  const moduleTemplate =
    userModules?.[userId] && modules?.[userModules[userId]] && modules?.[userModules[userId]]?.alias
      ? modules[userModules[userId]].alias
      : '';

  return {
    endpoint: {
      module: {
        alias: moduleTemplate,
      },
      user: {
        id: userId,
      },
    },
  };
};

export const createExecutors = (
  newExecutors: Array<{ fullName: string; id: string }>,
  modules: Record<string, IModule>,
  userModules: Record<string, string>,
) =>
  newExecutors.map(({ id }) => ({
    ...createMember(id, modules, userModules),
    rights: MemberRights.executor,
  }));

export const createCoExecutors = (
  newExecutors: Array<{ fullName: string; id: string }>,
  modules: Record<string, IModule>,
  userModules: Record<string, string>,
) =>
  newExecutors.map(({ id }) => ({
    ...createMember(id, modules, userModules),
    rights: MemberRights.coExecutor,
  }));

export const createObservers = (
  newObservers: Array<{ fullName: string; id: string }>,
  modules: Record<string, IModule>,
  userModules: Record<string, string>,
) =>
  newObservers.map(({ id }) => ({
    ...createMember(id, modules, userModules),
    rights: MemberRights.observer,
  }));

export const getMembersInfoListByIds = (ids: string[], users: Record<string, IUser>) => {
  return ids.map((id) => users[id]);
};
