import { MemberRights } from "../../const";
import { ITaskMember } from "../../types/tasksInterfaces";

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
  