import { MemberRights } from "../../../../../consts";
import { ITaskMember } from "../../types/tasksInterfaces";

export const getMembersWithoutObserves = (members: Array<ITaskMember> | null) => {
    if (!members) return [];
  
    return members.filter((member) => member.rights !== MemberRights.observer);
  };
  