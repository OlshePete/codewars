import { IProcessSubtaskBase, TSubtasks, TypesProcessSubtask } from "../../types/tasksInterfaces";

export const isProcessSubtask = (
    task: IProcessSubtaskBase | TSubtasks,
  ): task is IProcessSubtaskBase =>
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Branch ||
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Convert ||
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Receive ||
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Send ||
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Show ||
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Start ||
    (task as IProcessSubtaskBase).task.type === TypesProcessSubtask.Stop;
  