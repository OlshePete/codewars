import { MemberRights } from "../../const";
import { IModule, IUser } from "../../types/esbInterfaces";
import { IProcessSubtaskBase, ITaskMember, ITaskUser, TSubtasks, TViewTask, TasksStatus } from "../../types/tasksInterfaces";


type TUserState = Record<string, IUser>;

interface IGroupResult {
  [key: number]: ITaskMember[];
}
export const formatUserListFromServer = (users: IUser[]): TUserState => {
  return users.reduce<TUserState>((acc, el) => {
    acc[el.id] = el;
    return acc;
  }, {});
};

export const getUserShortName = (user?: IUser | null) => {
  if (!user) return '';

  const { surname, name, lastname } = user;

  if (surname) {
    if (name) {
      if (lastname) {
        return `${surname} ${name[0]}.${lastname[0]}.`;
      }

      return `${surname} ${name[0]}.`;
    }

    return `${surname}`;
  }

  if (!surname) {
    if (name) {
      if (lastname) {
        return `${name} ${lastname[0]}`;
      }

      return `${name}`;
    }

    return `${lastname || ''}`;
  }

  return '';
};
export const groupByRights = (data: ITaskMember[]) => {
  const result: IGroupResult = {};
  data.forEach((item) => {
    const rights = item.rights;
    if (!result[rights]) {
      result[rights] = [];
    }
    result[rights].push(item);
  });
  return result;
};

export const getUserFullName = (user?: IUser) => {
  if (!user) return '';

  const { surname, name, lastname } = user;

  if (surname) {
    if (name) {
      if (lastname) {
        return `${surname} ${name} ${lastname}`;
      }

      return `${surname} ${name}`;
    }

    if (lastname) {
      return `${surname} ${lastname}`;
    }

    return `${surname}`;
  }

  if (!surname) {
    if (name) {
      if (lastname) {
        return `${name} ${lastname}`;
      }

      return `${name}`;
    }

    return `${lastname || ''}`;
  }

  return '';
};

export const getTaskAuthorId = (task: TViewTask | null) => {
  if (!task) return null;

  return task.task.author.user.id;
};

export const getObservers = (members: Array<ITaskMember> | null) => {
  if (!members) return [];

  return members.filter((member) => member.rights === MemberRights.observer);
};

export const getExecutors = (members: Array<ITaskMember> | null) => {
  if (!members) return [];

  return members.filter((member) => member.rights === MemberRights.executor);
};

export const getCoExecutors = (members: Array<ITaskMember> | null) => {
  if (!members) return [];

  return members.filter((member) => member.rights === MemberRights.coExecutor);
};

export const createAuthor = (
  modules: Record<string, IModule>,
  selfId: string | null,
): Record<'author', ITaskUser> | null => {
  if (!selfId) return null;

  const alias = modules[selfId]?.alias;
  const userId = getUserSelfId(selfId, modules);

  if (alias && userId) {
    return {
      author: {
        module: {
          alias: modules[selfId].alias,
        },
        user: {
          id: getUserSelfId(selfId, modules) as string,
        },
      },
    };
  }

  return null;
};
export const getUserSelfId = (selfId: string, modules: Record<string, IModule>) => {
  const user = modules[selfId]?.user;

  if (!selfId || !user) return null;

  return user;
};

export const checkIsSubtasksDone = (
  subtasks: Record<string, TSubtasks | IProcessSubtaskBase>,
): boolean => {
  if (!subtasks || Object.keys(subtasks).length === 0) return true;

  return Object.values(subtasks).every((subtask) => {
    return (
      subtask.task.state.status !== TasksStatus.Awaiting &&
      subtask.task.state.status !== TasksStatus.Running
    );
  });
};
export const getMembersWithoutObserves = (members: Array<ITaskMember> | null) => {
  if (!members) return [];

  return members.filter((member) => member.rights !== MemberRights.observer);
};

export const checkSelfAsAuthor = (
  selfId: string | null,
  task: TViewTask,
  modules: Record<string, IModule>,
) => {
  if (!task || !selfId) return false;

  const userId = getUserSelfId(selfId, modules);
  const authorId = getTaskAuthorId(task);

  if (!authorId || !userId) return false;

  return authorId === userId;
};

export const checkSelfAsExecutor = (
  selfId: string | null,
  task: TViewTask,
  modules: Record<string, IModule>,
) => {
  if (!task || !selfId) return false;

  const userId = getUserSelfId(selfId, modules);
  const executors = getExecutors(task.task.members);

  const executor = executors.find((item) => item.endpoint.user.id === userId);

  return Boolean(executor);
};

export const checkSelfAsCoExecutor = (
  selfId: string | null,
  task: TViewTask,
  modules: Record<string, IModule>,
) => {
  if (!task || !selfId) return false;

  const userId = getUserSelfId(selfId, modules);
  const coExecutors = getCoExecutors(task.task.members);

  const coExecutor = coExecutors.find((item) => item.endpoint.user.id === userId);

  return Boolean(coExecutor);
};

export const checkSelfAsMembers = (
  selfId: string | null,
  task: TViewTask,
  modules: Record<string, IModule>,
) => {
  if (!task || !selfId) return false;

  const userId = getUserSelfId(selfId, modules);
  const member = task.task.members.find((item) => item.endpoint.user.id === userId);
  const isAuthor = checkSelfAsAuthor(selfId, task, modules);

  return isAuthor || Boolean(member);
};

export const membersToObservers = (members: Array<ITaskMember> | null): Array<ITaskMember> => {
  if (!members) return [];

  const usersId: Record<string, string> = {};

  return members.reduce<Array<ITaskMember>>((acc, member) => {
    if (!usersId[member.endpoint.user.id]) {
      usersId[member.endpoint.user.id] = member.endpoint.user.id;
      const cloneMember: ITaskMember = { ...member };
      cloneMember.rights = MemberRights.observer;
      acc.push(cloneMember);
    }

    return acc;
  }, []);
};
