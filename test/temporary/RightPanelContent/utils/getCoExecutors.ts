import { MemberRights } from "../../const";
import { ITaskMember } from "../../types/tasksInterfaces";

export const getCoExecutors = (members: Array<ITaskMember> | null) => {
  if (!members) return [];

  return members.filter((member) => member.rights === MemberRights.coExecutor);
};