import { ITaskHistory } from '../../../../../../../../../../types/tasksInterfaces';
import { TIME_TO_ARCHIVE_HISTORY_LABEL } from '../../../../../../../../kanban/utils/history/const';

export const groupHistoryByDate = (history: ITaskHistory[]): ITaskHistory[] => {
  const templateHistory = history.map((item) => ({ ...item }));
  const exceptionStatuses = ['subtasks', 'status', 'viewed'];

  if (templateHistory.length === 0 || !templateHistory) return [];

  return templateHistory.reduce<ITaskHistory[]>((acc, item) => {
    const indexItemWithSameDate = acc.findIndex((el) => el.date === item.date);

    if (
      indexItemWithSameDate >= 0 &&
      ((!exceptionStatuses.includes(item.typeHistory) &&
        !exceptionStatuses.includes(acc[indexItemWithSameDate].typeHistory)) ||
        (item.typeHistory === 'status' &&
          acc[indexItemWithSameDate].typeHistory === 'status' &&
          acc[indexItemWithSameDate].description.includes(TIME_TO_ARCHIVE_HISTORY_LABEL))) &&
      item.editor &&
      acc[indexItemWithSameDate].editor === item.editor
    ) {
      if (!acc[indexItemWithSameDate].description.includes(item.description)) {
        acc[indexItemWithSameDate].description += `\n${item.description}`;
      }
    } else {
      acc.push(item);
    }

    return acc;
  }, []);
};
