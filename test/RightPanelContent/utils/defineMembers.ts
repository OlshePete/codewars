import { ITaskMember } from '../../../../types/tasksInterfaces';
import { MemberRights } from '../../../consts';

type TStringMap = Record<string, string>;

type MembersHash = {
  executors: TStringMap;
  coExecutors: TStringMap;
  observers: TStringMap;
};

export const defineMembers = (
  observers: Array<ITaskMember>,
  membersWithoutObserves: Array<ITaskMember>,
  authorID: string,
): ITaskMember[] => {
  const result: ITaskMember[] = [];

  const hash: MembersHash = { executors: {}, coExecutors: {}, observers: {} };
  membersWithoutObserves.forEach((member) => {
    const key = member.endpoint.user.id;
    switch (member.rights) {
      case MemberRights.executor:
        hash.executors[key] = key;
        result.push(member);
        break;
      case MemberRights.coExecutor:
        hash.coExecutors[key] = key;
        result.push(member);
        break;

      default:
        break;
    }
  });
  observers.forEach((observer) => {
    const key = observer.endpoint.user.id;

    if (
      hash.observers[key] === undefined &&
      hash.executors[key] === undefined &&
      hash.coExecutors[key] === undefined &&
      key !== authorID
    ) {
      hash.observers[key] = key;
      result.push(observer);
    }
  });

  return result;
};
