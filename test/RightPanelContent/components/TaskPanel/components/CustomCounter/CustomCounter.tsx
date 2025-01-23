import clsx from 'clsx';
import React, { FC } from 'react';
import './CustomCounter.scss';
import { makeStyles, useTheme } from '@uds/utils';
import { CustomCounterStyles } from './CustomCounter.styles';

const useStyles = makeStyles(CustomCounterStyles);

const CustomCounter: FC<{ count: number; isAccent?: boolean }> = ({ count, isAccent = false }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <span className={clsx('count', classes.root, isAccent && 'accent')}>
      <span>{count}</span>
    </span>
  );
};

export default CustomCounter;
