import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { isNumber, makeStyles, useTheme } from '@uds/utils';
import { UDSTitle } from '@uds/react-components';
import { EditTaskTermsStyles } from './EditTaskTerms.styles';
import type { IEditTaskTerms } from './EditTaskTerms.types';
import './EditTaskTerms.scss';
import { EditTaskTimeToArchive } from './components/EditTaskTimeToArchive';
import EditSeparateDateTime from './components/EditSeparateDateTime/EditSeparateDateTime';
import { TaskErrors } from '../../../../../../../../../context/useTaskPanelContext';
import { ITaskTimeframe } from '../../../../../../../../../types/tasksInterfaces';

const useStyles = makeStyles(EditTaskTermsStyles);
const EditTaskTerms: React.FC<Partial<IEditTaskTerms>> = ({
  timeframe,
  setTimeframe,
  errors,
  setError,
  startDisabled,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  const [beginInputValue, setBeginInputValue] = useState<number | null>(timeframe?.begin || null);
  const [endInputValue, setEndInputValue] = useState<number | null>(timeframe?.end || null);

  const clearError = () => {
    if (setError && typeof setError === 'function') {
      setError([TaskErrors.Begin, TaskErrors.End], null);
    }
  };

  const updateTimeframe = () => {
    if (setTimeframe && typeof setTimeframe === 'function') {
      const newTimeframe: ITaskTimeframe = {
        ...timeframe,
      };

      if (isNumber(endInputValue)) {
        newTimeframe.end = endInputValue;
      } else {
        delete newTimeframe.end;
      }

      if (isNumber(beginInputValue)) {
        newTimeframe.begin = beginInputValue;
      } else {
        delete newTimeframe.begin;
      }

      setTimeframe(newTimeframe);
    }
    clearError();
  };

  useEffect(updateTimeframe, [beginInputValue, endInputValue]);

  const onChangeBegin = (value?: number | undefined) => {
    //TODO: - refactoring event.target
    setBeginInputValue(isNumber(value) ? value : null);
  };

  const onChangeEnd = (value?: number | undefined) => {
    //TODO: - refactoring event.target
    setEndInputValue(isNumber(value) ? value : null);
  };

  return (
    <div className={clsx('EditTaskTerms', classes.root)}>
      <div className={clsx('Group')}>
        <UDSTitle className={clsx('Title')} isInvalid={Boolean(errors?.begin)}>
          Дата и время начала задачи
        </UDSTitle>

        <EditSeparateDateTime
          value={beginInputValue ?? undefined}
          onChange={onChangeBegin}
          error={errors?.begin || undefined}
          disabled={startDisabled}
        />
      </div>

      <div className={clsx('Group')}>
        <UDSTitle className={clsx('Title')} isInvalid={Boolean(errors?.end)}>
          Дата и время завершения задачи
        </UDSTitle>

        <EditSeparateDateTime
          value={timeframe?.end}
          onChange={onChangeEnd}
          error={errors?.end || undefined}
        />
      </div>

      <div className={clsx('Group')}>
        <EditTaskTimeToArchive
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          errors={errors}
          setError={setError}
        />
      </div>
    </div>
  );
};

export default EditTaskTerms;
