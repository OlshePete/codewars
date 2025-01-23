import React, { FC, useEffect, useState } from 'react';
import { EditTaskTimeToArchiveStyles } from './EditTaskTimeToArchive.styles';
import styles from './EditTaskTimeToArchive.module.scss';
import { UDSInput, UDSTitle } from '@uds/react-components';
import clsx from 'clsx';
import { IEditTaskTimeToArchive } from './EditTaskTimeToArchive.types';
import { isNumber, makeStyles, useTheme } from '@uds/utils';
import { useLocation } from 'react-router-dom';
import { TaskErrors } from '../../../../../../../../../../../SkifTaskPanel/context2/useTaskPanelContext';
import { ROUTES } from '../../../../../../../../../../../../consts';
import { usePanelDataContext } from '../../../../../../../../../../../SkifTaskPanel/context2/usePanelDataContext';

const useStyles = makeStyles(EditTaskTimeToArchiveStyles);
const EditTaskTimeToArchive: FC<Partial<IEditTaskTimeToArchive>> = ({
  timeframe,
  setTimeframe,
  setError,
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const { pathname } = useLocation();
  const { taskSettings } = usePanelDataContext();
  const defaultLifetime = taskSettings.lifetime;
  const [toArchiveDelayValue, setToArchiveDelayValue] = useState<number | '' | undefined>(
    timeframe?.lifetime || timeframe?.lifetime === 0 ? timeframe.lifetime : defaultLifetime,
  );
  const clearError = (): void => {
    if (setError && typeof setError === 'function') {
      setError([TaskErrors.Begin, TaskErrors.End], null);
    }
  };

  const updateTimeframe = () => {
    if (setTimeframe && typeof setTimeframe === 'function') {
      const newTimeframe: typeof timeframe = {
        ...timeframe,
      };

      if (isNumber(toArchiveDelayValue)) {
        newTimeframe.lifetime = toArchiveDelayValue;
      } else {
        delete newTimeframe.lifetime;
      }

      setTimeframe(newTimeframe);
    }
    clearError();
  };

  useEffect(updateTimeframe, [toArchiveDelayValue]);

  const onChangeArchiveDelay = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    if (Number(value) || Number(value) === 0) setToArchiveDelayValue(Number(value) * 86400);
  };

  if (pathname === ROUTES.SubtasksPage) return <></>;

  return (
    <>
      <UDSTitle className={clsx(classes.root, styles.Title)}>В архив через, дней</UDSTitle>
      <UDSInput
        type="number"
        className={clsx(styles.archiveInput)}
        step={1}
        min={0}
        value={`${toArchiveDelayValue ? toArchiveDelayValue / 86400 : 0}`}
        onChange={onChangeArchiveDelay}
      />
    </>
  );
};

export default EditTaskTimeToArchive;
