import { MemberRights } from "../../const";
import { ITaskMember } from "../../types/tasksInterfaces";

export const getExecutors = (members: Array<ITaskMember> | null) => {
    if (!members) return [];
  
    return members.filter((member) => member.rights === MemberRights.executor);
  };