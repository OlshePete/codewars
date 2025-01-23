import * as React from 'react';
import clsx from 'clsx';
import { hexToRGBA, makeStyles, rgbaToHex, useTheme } from '@uds/utils';
import { Header } from './components/Header';
import { HistoryItem } from './components/HistoryItem';
import { ViewHistoryStyles } from './ViewHistory.styles';
import type { IViewHistory } from './ViewHistory.types';
import './ViewHistory.scss';
import { groupHistoryByDate } from './utils/groupHistoryByDate';
import { TypesTask, TypesTaskHistory } from '../../../../../../../types/tasksInterfaces';

const useStyles = makeStyles(ViewHistoryStyles);

const ViewHistory: React.FC<IViewHistory> = ({ history, colorTask, onClickItem, ...props }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  let colorTask10 = rgbaToHex(hexToRGBA(colorTask, 0.1));
  let colorTask20 = rgbaToHex(hexToRGBA(colorTask, 0.2));

  if (theme.palette.mode === 'dark') {
    colorTask10 = hexToRGBA(colorTask10, 0.2);
    colorTask20 = hexToRGBA(colorTask20, 0.2);
  }
  const groupedHistory = groupHistoryByDate(history);
  return (
    <div
      className={clsx('ViewHistory', classes.root)}
      style={{ backgroundColor: colorTask10, ...props.style }}
      {...props}
    >
      <Header style={{ backgroundColor: colorTask20 }} />
      {groupedHistory.map((it, key) => (
        <HistoryItem
          key={key}
          className={clsx({ 'HistoryItem--link': it.typeHistory === TypesTaskHistory.Subtasks })}
          date={it.date}
          editor={it.editor}
          description={it.description}
          onClickItem={() =>
            onClickItem &&
            it.options &&
            onClickItem({
              taskId: it.options.currentTask,
              subtaskId: it.options.currentSubtask,
              subtaskType: it.options.typesSubtask as
                | TypesTask.PfFlow
                | TypesTask.Discus
                | TypesTask.Process,
              typeHistory: it.typeHistory,
            })
          }
        />
      ))}
    </div>
  );
};

export default ViewHistory;
